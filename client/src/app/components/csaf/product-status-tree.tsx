import React from "react";

import {
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  List,
  ListItem,
  TreeView,
  TreeViewDataItem
} from "@patternfly/react-core";


const branchToTreeViewDataItem = (branches: { [k: string]: string[] }) => {
  return Object.entries(branches).map(([key, value]) => {
    let result: TreeViewDataItem = {
      name: key,
      children: value.map((child) => {
        let title_splited = child.split(":");

        let treeChild: TreeViewDataItem = {
          name:
            title_splited.length === 2
              ? `${title_splited[1]} (${title_splited[0]})`
              : key,
        };
        return treeChild;
      }),
      defaultExpanded: false,
    };
    return result;
  });
};

interface ProductStatusTreeProps {
  variant: "tree" | "list";
  branches: { [k: string]: string[] };
}

export const ProductStatusTree: React.FC<ProductStatusTreeProps> = ({
  variant,
  branches,
}) => {
  if (variant === "list") {
    return Object.entries(branches).map(([key, value]) => (
      <DescriptionListGroup>
        <DescriptionListTerm>{key}</DescriptionListTerm>
        <DescriptionListDescription>
          <List>
            {value.map((item, index) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
          </List>
        </DescriptionListDescription>
      </DescriptionListGroup>
    ));
  } else {
    return (
      <TreeView
        data={branchToTreeViewDataItem(branches)}
        hasGuides={true}
        useMemo
      />
    );
  }
};
