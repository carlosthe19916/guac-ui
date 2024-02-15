import {
  ExpandableRowContent,
  IExtraData,
  IRowData,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import React from "react";

import { Vulnerability } from "@app/api/models";
import { useSelectionState } from "@app/hooks/useSelectionState";
import { List, ListItem } from "@patternfly/react-core";
import dayjs from "dayjs";
import { RENDER_DATE_FORMAT } from "@app/Constants";

interface RemediationsProps {
  vulnerabily: Vulnerability;
}

export const Remediations: React.FC<RemediationsProps> = ({ vulnerabily }) => {
  const { isItemSelected, toggleItemSelected } = useSelectionState({
    items: vulnerabily.remediations,
  });

  return (
    <>
      <Table variant="compact">
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Category</Th>
            <Th>Details</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>

        {vulnerabily.remediations.map((item, index) => (
          <Tbody key={index}>
            <Tr>
              <Td
                expand={{
                  isExpanded: isItemSelected(item),
                  rowIndex: index,
                  onToggle: () => {
                    toggleItemSelected(item);
                  },
                }}
              />
              <Td>
                {item.url ? (
                  <a href={item.url} target="_blank">
                    {item.category}
                  </a>
                ) : (
                  item.category
                )}
              </Td>
              <Td>{item.details}</Td>
            </Tr>
            {isItemSelected(item) ? (
              <Tr isExpanded>
                <Td />
                <Td noPadding colSpan={3}>
                  <ExpandableRowContent>
                    <List>
                      {item.product_ids.map((e, index) => {
                        let title_splited = e.split(":");

                        return (
                          <ListItem key={index}>
                            {title_splited.length === 2
                              ? `${title_splited[1]} (${title_splited[0]})`
                              : e}
                          </ListItem>
                        );
                      })}
                    </List>
                  </ExpandableRowContent>
                </Td>
                <Td>
                  {item.date ? dayjs(item.date).format(RENDER_DATE_FORMAT) : ""}
                </Td>
              </Tr>
            ) : null}
          </Tbody>
        ))}
      </Table>
    </>
  );
};
