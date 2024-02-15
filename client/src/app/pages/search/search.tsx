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

export const Search: React.FC = () => {
  return (
    <>
      <PageSection variant="light">
        <Split>
          <SplitItem isFilled>
            <TextContent>
              <Text component="h1">Search results</Text>
            </TextContent>
          </SplitItem>
          <SplitItem>
            <SearchInput style={{ width: 600 }} />
          </SplitItem>
        </Split>
      </PageSection>
      <PageSection>hello</PageSection>
    </>
  );
};
