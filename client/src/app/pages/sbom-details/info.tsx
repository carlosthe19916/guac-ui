import { RENDER_DATE_FORMAT } from "@app/Constants";
import { Sbom, SbomCycloneDx, SbomSPDX, SbomType } from "@app/api/models";
import {
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
  Label,
  List,
  ListItem,
} from "@patternfly/react-core";
import dayjs from "dayjs";
import prettyBytes from "pretty-bytes";
import React from "react";

interface InfoProps {
  data: Sbom;
}

export const Info: React.FC<InfoProps> = ({ data }) => {
  const sbomSize = React.useMemo(() => {
    const blob = new Blob([JSON.stringify(data.sbom, null, 2)], {
      type: "application/json",
    });
    return blob.size;
  }, [data]);

  switch (data.type) {
    case SbomType.SPDX:
      return <SpxdInfo sbom={data.sbom} size={sbomSize} />;
    case SbomType.CycloneDx:
      return <CycloneDxInfo sbom={data.sbom} size={sbomSize} />;
    default:
      return <>Not supported SBOM format</>;
  }
};

interface SpdxInfoProps {
  sbom: SbomSPDX;
  size: number;
}

export const SpxdInfo: React.FC<SpdxInfoProps> = ({ sbom, size }) => {
  const mainPackage = React.useMemo(() => {
    return sbom.packages.find((e) => e.name === sbom.name);
  }, [sbom]);

  return (
    <>
      <Grid hasGutter>
        <GridItem md={6}>
          <Card isFullHeight>
            <CardTitle>Metadata</CardTitle>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Name</DescriptionListTerm>
                  <DescriptionListDescription>
                    {sbom.name}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Namespace</DescriptionListTerm>
                  <DescriptionListDescription>
                    {sbom.documentNamespace}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>SPDX version</DescriptionListTerm>
                  <DescriptionListDescription>
                    {sbom.spdxVersion}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Data license</DescriptionListTerm>
                  <DescriptionListDescription>
                    {sbom.dataLicense}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem md={3}>
          <Card isFullHeight>
            <CardTitle>Creation</CardTitle>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Created</DescriptionListTerm>
                  <DescriptionListDescription>
                    {dayjs(sbom.creationInfo.created).format(
                      RENDER_DATE_FORMAT
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    License list version
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    {sbom.creationInfo.licenseListVersion}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Creator</DescriptionListTerm>
                  <DescriptionListDescription>
                    {sbom.creationInfo.creators}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem md={3}>
          <Card isFullHeight>
            <CardTitle>Statistics</CardTitle>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>size</DescriptionListTerm>
                  <DescriptionListDescription>
                    {prettyBytes(size)}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Packages</DescriptionListTerm>
                  <DescriptionListDescription>
                    {sbom.packages.length}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </GridItem>
        {mainPackage && (
          <GridItem md={12}>
            <Card isFullHeight>
              <CardTitle>Package</CardTitle>
              <CardBody>
                <DescriptionList>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Name</DescriptionListTerm>
                    <DescriptionListDescription>
                      {mainPackage.name}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Version</DescriptionListTerm>
                    <DescriptionListDescription>
                      {mainPackage.versionInfo}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>
                      External references
                    </DescriptionListTerm>
                    <DescriptionListDescription>
                      <List>
                        {mainPackage.externalRefs?.map((e, index) => (
                          <ListItem key={index}>
                            {e.referenceLocator}{" "}
                            <Label color="blue" isCompact>
                              {e.referenceCategory}
                            </Label>{" "}
                            <Label isCompact>{e.referenceType}</Label>
                          </ListItem>
                        ))}
                      </List>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </CardBody>
            </Card>
          </GridItem>
        )}
      </Grid>
    </>
  );
};

interface CycloneDxInfoProps {
  sbom: SbomCycloneDx;
  size: number;
}

export const CycloneDxInfo: React.FC<CycloneDxInfoProps> = ({ sbom, size }) => {
  return (
    <>
      <Grid hasGutter>
        <GridItem md={6}>
          <Card isFullHeight>
            <CardTitle>Metadata</CardTitle>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Name</DescriptionListTerm>
                  <DescriptionListDescription>
                    {sbom.metadata.component.name}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Serial number</DescriptionListTerm>
                  <DescriptionListDescription>
                    {sbom.serialNumber}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Spec version</DescriptionListTerm>
                  <DescriptionListDescription>
                    {sbom.specVersion}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Data license</DescriptionListTerm>
                  <DescriptionListDescription>
                    {sbom.metadata.component.licenses?.map((e) => e.license.id)}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem md={3}>
          <Card isFullHeight>
            <CardTitle>Creation</CardTitle>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Created</DescriptionListTerm>
                  <DescriptionListDescription>
                    {dayjs(sbom.metadata.timestamp).format(RENDER_DATE_FORMAT)}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem md={3}>
          <Card isFullHeight>
            <CardTitle>Statistics</CardTitle>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>size</DescriptionListTerm>
                  <DescriptionListDescription>
                    {prettyBytes(size)}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Packages</DescriptionListTerm>
                  <DescriptionListDescription>
                    {sbom.components.length}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem md={12}>
          <Card isFullHeight>
            <CardTitle>Package</CardTitle>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Name</DescriptionListTerm>
                  <DescriptionListDescription>
                    {sbom.metadata.component.name}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Version</DescriptionListTerm>
                  <DescriptionListDescription>
                    {sbom.metadata.component.version}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>External references</DescriptionListTerm>
                  <DescriptionListDescription>
                    <List>
                      {sbom.metadata.component.externalReferences?.map(
                        (e, index) => (
                          <ListItem key={index}>
                            {e.url}{" "}
                            <Label color="blue" isCompact>
                              {e.type}
                            </Label>
                          </ListItem>
                        )
                      )}
                    </List>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
};
