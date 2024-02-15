import React, { useMemo } from "react";

import {
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Label,
  List,
  ListItem,
  Stack,
  StackItem,
  TreeView,
  TreeViewDataItem,
} from "@patternfly/react-core";
import ExternalLinkAltIcon from "@patternfly/react-icons/dist/esm/icons/external-link-alt-icon";

import dayjs from "dayjs";
import prettyBytes from "pretty-bytes";

import { Advisory, Branch } from "@app/api/models";
import { RHSeverityShield } from "@app/components/csaf/rh-severity";
import { RENDER_DATE_FORMAT } from "@app/Constants";

import { CSAFCategoryLabel } from "./csaf-category";

const branchToTreeViewDataItem = (branches: Branch[]) => {
  return branches.map((branch) => {
    let result: TreeViewDataItem = {
      name: (
        <Flex>
          <FlexItem spacer={{ default: "spacerSm" }}>{branch.name}</FlexItem>
          <FlexItem>
            <Label variant="outline" color="blue" isCompact>
              {branch.category}
            </Label>
          </FlexItem>
        </Flex>
      ),
      children: branch.branches
        ? branchToTreeViewDataItem(branch.branches)
        : undefined,
      defaultExpanded: false,
    };
    return result;
  });
};

interface OverviewProps {
  advisory: Advisory;
}

export const Overview: React.FC<OverviewProps> = ({ advisory }) => {
  const objSize = useMemo(() => {
    const blob = new Blob([JSON.stringify(advisory, null, 2)], {
      type: "application/json",
    });
    return blob.size;
  }, [advisory]);

  let productTreeData = useMemo(() => {
    return branchToTreeViewDataItem(advisory.product_tree.branches);
  }, [advisory]);

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Grid hasGutter>
            <GridItem md={4}>
              <Card isFullHeight>
                <CardTitle>Overview</CardTitle>
                <CardBody>
                  <DescriptionList>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Title</DescriptionListTerm>
                      <DescriptionListDescription>
                        {advisory.vulnerabilities.map((e) => e.title)}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Category</DescriptionListTerm>
                      <DescriptionListDescription>
                        <CSAFCategoryLabel value={advisory.document.category} />
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>
                        Aggregate severity
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        <RHSeverityShield
                          value={advisory.document.aggregate_severity.text}
                        />
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Size</DescriptionListTerm>
                      <DescriptionListDescription>
                        {prettyBytes(objSize)}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={4}>
              <Card isFullHeight>
                <CardTitle>Publisher</CardTitle>
                <CardBody>
                  <DescriptionList>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Name</DescriptionListTerm>
                      <DescriptionListDescription>
                        {advisory.document.publisher.name}{" "}
                        <Label color="blue">
                          {advisory.document.publisher.category}
                        </Label>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Namespace</DescriptionListTerm>
                      <DescriptionListDescription>
                        <CSAFCategoryLabel
                          value={advisory.document.publisher.namespace}
                        />
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Contact details</DescriptionListTerm>
                      <DescriptionListDescription>
                        {advisory.document.publisher.contact_details}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>
                        Issuing authority
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        {advisory.document.publisher.issuing_authority}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={4}>
              <Card isFullHeight>
                <CardTitle>Tracking</CardTitle>
                <CardBody>
                  <DescriptionList>
                    <DescriptionListGroup>
                      <DescriptionListTerm>ID</DescriptionListTerm>
                      <DescriptionListDescription>
                        {advisory.document.tracking.id}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Status</DescriptionListTerm>
                      <DescriptionListDescription>
                        {advisory.document.tracking.status}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>
                        Initial release date
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        {dayjs(
                          advisory.document.tracking.initial_release_date
                        ).format(RENDER_DATE_FORMAT)}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>
                        Current release date
                      </DescriptionListTerm>
                      <DescriptionListDescription>
                        {dayjs(
                          advisory.document.tracking.current_release_date
                        ).format(RENDER_DATE_FORMAT)}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </StackItem>
        <StackItem>
          <Grid hasGutter>
            <GridItem md={4}>
              <Card isFullHeight>
                <CardTitle>References</CardTitle>
                <CardBody>
                  <List>
                    {advisory.document.references.map((e, index) => (
                      <ListItem key={index}>
                        <a href={e.url} target="_blank">
                          {e.summary} <ExternalLinkAltIcon />
                        </a>{" "}
                        <Label color="blue" isCompact>
                          {e.category}
                        </Label>
                      </ListItem>
                    ))}
                  </List>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem md={8}>
              <Card isFullHeight>
                <CardTitle>Product info</CardTitle>
                <CardBody>
                  <TreeView
                    data={productTreeData}
                    hasGuides={true}
                    variant="default"
                    useMemo
                  />
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </StackItem>
      </Stack>
    </>
  );
};
