import React from "react";

import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Flex,
  FlexItem,
  Gallery,
  GalleryItem,
  Grid,
  GridItem,
  Icon,
  List,
  ListItem,
  PageSection,
  PageSectionVariants,
  SearchInput,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextContent,
} from "@patternfly/react-core";
import CheckIcon from "@patternfly/react-icons/dist/esm/icons/check-icon";
import ShieldIcon from "@patternfly/react-icons/dist/esm/icons/shield-alt-icon";
import BugIcon from "@patternfly/react-icons/dist/esm/icons/bug-icon";
import HandIcon from "@patternfly/react-icons/dist/esm/icons/hand-holding-icon";

const TEXT_WIDTH = 192;

export const Home: React.FC = () => {
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Red Hat Trusted Profile Analyzer</Text>
          <Text component="small">
            A managed service for software supply chain security
          </Text>
          <Text component="p">
            The Red Hat Trusted Profile Analyzer service brings awareness to and
            remediation of Open Source Software (OSS) vulnerabilities that are
            discovered within the software supply chain. The Red Hat Trusted
            Profile Analyzer service works within the software supply chain by
            helping developers to identify, and resolve security vulnerabilities
            during their development cycle.
          </Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.default}>
        <Stack hasGutter>
          <StackItem>
            <Card>
              <CardBody>
                <Stack hasGutter>
                  <StackItem>
                    <Bullseye>
                      <Split hasGutter>
                        <SplitItem>
                          <SearchInput
                            placeholder="Search for an SBOM, Advisory, or CVE"
                            // value={value}
                            // onChange={(_event, value) => onChange(value)}
                            // onClear={() => onChange("")}
                            style={{ width: 400 }}
                          />
                        </SplitItem>
                        <SplitItem>
                          <Button variant="primary">Search</Button>
                        </SplitItem>
                      </Split>
                    </Bullseye>
                  </StackItem>
                  <StackItem>
                    <Bullseye>
                      <Flex>
                        <FlexItem>
                          <Card isPlain>
                            <CardBody>
                              <Bullseye>
                                <Icon size="xl">
                                  <CheckIcon />
                                </Icon>
                              </Bullseye>
                            </CardBody>
                            <CardFooter>
                              <Bullseye style={{ width: TEXT_WIDTH }}>
                                I need an SBOM for..
                              </Bullseye>
                            </CardFooter>
                          </Card>
                        </FlexItem>
                        <FlexItem>
                          <Card isPlain>
                            <CardBody>
                              <Bullseye>
                                <Icon size="xl">
                                  <ShieldIcon />
                                </Icon>
                              </Bullseye>
                            </CardBody>
                            <CardFooter>
                              <Bullseye style={{ width: TEXT_WIDTH }}>
                                I have an SBOM and need vulnerability
                                information
                              </Bullseye>
                            </CardFooter>
                          </Card>
                        </FlexItem>
                        <FlexItem>
                          <Card isPlain>
                            <CardBody>
                              <Bullseye>
                                <Icon size="xl">
                                  <BugIcon />
                                </Icon>
                              </Bullseye>
                            </CardBody>
                            <CardFooter>
                              <Bullseye style={{ width: TEXT_WIDTH }}>
                                I need information on a specific vulnerability
                              </Bullseye>
                            </CardFooter>
                          </Card>
                        </FlexItem>
                        <FlexItem>
                          <Card isPlain>
                            <CardBody>
                              <Bullseye>
                                <Icon size="xl">
                                  <HandIcon />
                                </Icon>
                              </Bullseye>
                            </CardBody>
                            <CardFooter>
                              <Bullseye style={{ width: TEXT_WIDTH }}>
                                I want to browse by category: UBI, RHEL, …
                              </Bullseye>
                            </CardFooter>
                          </Card>
                        </FlexItem>
                      </Flex>
                    </Bullseye>
                  </StackItem>
                </Stack>
              </CardBody>
            </Card>
          </StackItem>
          <StackItem>
            <Grid hasGutter>
              <GridItem md={6}>
                <Card isFullHeight>
                  <CardTitle>Scan your SBOM</CardTitle>
                  <CardBody>
                    By scanning your Software Bill of Materials (SBOM) file, you
                    receive a detailed report of dependencies, and potential
                    vulnerabilities within your software stack. Start by
                    clicking the Scan an SBOM button. Red Hat does not store
                    SBOM files submitted for scanning.
                  </CardBody>
                  <CardFooter>
                    <Bullseye>
                      <Button variant="primary" size="lg">
                        Scan an SBOM
                      </Button>
                    </Bullseye>
                  </CardFooter>
                </Card>
              </GridItem>
              <GridItem md={6}>
                <Card isFullHeight>
                  <CardTitle>Getting started!</CardTitle>
                  <CardBody>
                    <List isPlain>
                      <ListItem>
                        <a
                          target="_blank"
                          href="https://access.redhat.com/documentation/en-us/red_hat_trusted_profile_analyzer/2023-q4/html/quick_start_guide/searching-for-vulnerability-information_tc-qsg"
                        >
                          Searching for vulnerability information
                        </a>
                      </ListItem>
                      <ListItem>
                        <a
                          target="_blank"
                          href="https://access.redhat.com/documentation/en-us/red_hat_trusted_profile_analyzer/2023-q4/html/quick_start_guide/scanning-an-sbom-file_tc-qsg"
                        >
                          Scanning a software bill of materials file
                        </a>
                      </ListItem>
                      <ListItem>
                        <a
                          target="_blank"
                          href="https://access.redhat.com/documentation/en-us/red_hat_trusted_profile_analyzer/2023-q4/html/quick_start_guide/configuring-visual-studio-code-to-use-dependency-analytics_tc-qsg"
                        >
                          Configuring Visual Studio Code to use Dependency
                          Analytics
                        </a>
                      </ListItem>
                      <ListItem>
                        <a
                          target="_blank"
                          href="https://access.redhat.com/documentation/en-us/red_hat_trusted_profile_analyzer/2023-q4/html/quick_start_guide/configuring-intellij-to-use-dependency-analytics_tc-qsg"
                        >
                          Configuring IntelliJ to use Dependency Analytics
                        </a>
                      </ListItem>
                      <ListItem>
                        <a
                          target="_blank"
                          href="https://access.redhat.com/documentation/en-us/red_hat_trusted_profile_analyzer/2023-q4/html/reference_guide/glossary_tc-ref"
                        >
                          Glossary
                        </a>
                      </ListItem>
                      <ListItem>
                        <a
                          target="_blank"
                          href="https://access.redhat.com/documentation/en-us/red_hat_trusted_profile_analyzer/2023-q4/html/reference_guide/frequently-asked-questions_tc-ref"
                        >
                          Frecuently Asked Questions
                        </a>
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
