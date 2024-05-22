import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Bullseye,
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Icon,
  List,
  ListItem,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  Text,
  TextContent,
} from "@patternfly/react-core";
import EyeIcon from "@patternfly/react-icons/dist/esm/icons/eye-icon";
import BugIcon from "@patternfly/react-icons/dist/esm/icons/bug-icon";
import CheckIcon from "@patternfly/react-icons/dist/esm/icons/check-icon";

const TEXT_WIDTH = 192;

export const Home: React.FC = () => {
  const [filterText, setFilterText] = React.useState("");
  const navigate = useNavigate();

  const redirectToSearch = () => {
    navigate("/search?filtertext=" + encodeURIComponent(filterText));
  };

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">GUAC</Text>
          <Text component="small">Know your software supply chain</Text>
          <Text component="p">
            GUAC gives you directed, actionable insights into the security of
            your software supply chain.
          </Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.default}>
        <Stack hasGutter>
          <StackItem>
            <Card isFullHeight>
              <CardTitle>
                The current problem with software supply chain security
              </CardTitle>
              <CardBody>
                Software supply chain attacks are on the rise and it’s hard to
                know what your software is at risk for and how to protect it.
                Many tools are available to help you generate Software Bills of
                Materials (SBOMs), signed attestations, and vulnerability
                reports, but they stop there, leaving you to figure out how they
                all fit together.
              </CardBody>
            </Card>
          </StackItem>
          <StackItem>
            <Card isFullHeight>
              <CardTitle>How GUAC can help you</CardTitle>
              <CardBody>
                These are just a few examples of insights that GUAC can give you
                to improve your software security posture
              </CardBody>
            </Card>
          </StackItem>
          <StackItem>
            <Grid hasGutter>
              <GridItem md={4}>
                <Card isFullHeight>
                  <CardTitle>Unveils gaps</CardTitle>
                  <CardBody>
                    <Bullseye>
                      <Icon size="xl">
                        <EyeIcon />
                      </Icon>
                    </Bullseye>
                  </CardBody>
                  <CardBody>
                    <List>
                      <ListItem>
                        Find the most used critical components in a software
                        supply chain ecosystem
                      </ListItem>
                      <ListItem>
                        Track if all binaries in production trace back to a
                        securely managed repository
                      </ListItem>
                      <ListItem>
                        Prevent supply chain compromises before they happen
                      </ListItem>
                      <ListItem>Find exposures to risky dependencies</ListItem>
                    </List>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem md={4}>
                <Card isFullHeight>
                  <CardTitle>Compliance</CardTitle>
                  <CardBody>
                    <Bullseye>
                      <Icon size="xl">
                        <CheckIcon />
                      </Icon>
                    </Bullseye>
                  </CardBody>
                  <CardBody>
                    <List>
                      <ListItem>
                        Determine ownership of applications by organization
                      </ListItem>
                      <ListItem>
                        Look for evidence that the application you{"'"}re about
                        to deploy meets your organization{"'"}s policies
                      </ListItem>
                      <ListItem>
                        Determine which application is missing SBOM or SLSA
                        attestations
                      </ListItem>
                      <ListItem>
                        Conduct SBOM Diffs to quickly determine changes between
                        versions
                      </ListItem>
                    </List>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem md={4}>
                <Card isFullHeight>
                  <CardTitle>Threat Detection</CardTitle>
                  <CardBody>
                    <Bullseye>
                      <Icon size="xl">
                        <BugIcon />
                      </Icon>
                    </Bullseye>
                  </CardBody>
                  <CardBody>
                    <List>
                      <ListItem>
                        Determine the blast radius of a bad package or a
                        vulnerability and provide information and a patch plan
                        towards remediation
                      </ListItem>
                      <ListItem>
                        Track a suspicious project lifecycle event back to when
                        it was introduced
                      </ListItem>
                      <ListItem>
                        Obtain greater insight into vendor software
                        vulnerabilities via VEX and project deprecation
                      </ListItem>
                    </List>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </StackItem>
        </Stack>
      </PageSection>
    </>
  );
};
