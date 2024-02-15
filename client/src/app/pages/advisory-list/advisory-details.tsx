import React from "react";
import { NavLink } from "react-router-dom";

import { ProductStatusTree } from "@app/components/csaf/product-status-tree";
import { SeverityRenderer } from "@app/components/csaf/severity-renderer";
import { useFetchAdvisoryById } from "@app/queries/advisories";
import { Bullseye, Spinner, Tooltip } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import dayjs from "dayjs";

interface AdvisoryDetailsProps {
  id: string;
}

export const AdvisoryDetails: React.FC<AdvisoryDetailsProps> = ({ id }) => {
  const { advisory, isFetching } = useFetchAdvisoryById(id);

  if (isFetching) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <>
      <Table aria-label="CVEs table" variant="compact">
        <Thead>
          <Tr>
            <Th>CVE ID</Th>
            <Th>Title</Th>
            <Th>Discovery</Th>
            <Th>Release</Th>
            <Th>Score</Th>
            <Th>CWE</Th>
            <Th>Products</Th>
          </Tr>
        </Thead>
        <Tbody>
          {advisory?.vulnerabilities.map((vulnerability) => (
            <Tr key={vulnerability.cve}>
              <Td width={10}>
                <NavLink to={`/cves/${vulnerability.cve}`}>
                  {vulnerability.cve}
                </NavLink>
              </Td>
              <Td modifier="truncate">{vulnerability.title}</Td>
              <Td width={10}>
                {dayjs(vulnerability.discovery_date).format("MMM DD, YYYY")}
              </Td>
              <Td width={10}>
                {dayjs(vulnerability.release_date).format("MMM DD, YYYY")}
              </Td>
              <Td width={10}>
                {vulnerability.scores
                  .flatMap((item) => item.cvss_v3)
                  .map((item, index) => (
                    <SeverityRenderer
                      key={index}
                      variant="progress"
                      score={item.baseScore}
                      severity={item.baseSeverity}
                    />
                  ))}
              </Td>
              <Td width={10}>
                {vulnerability.cwe ? (
                  <Tooltip content={vulnerability.cwe.name}>
                    <span>{vulnerability.cwe.id}</span>
                  </Tooltip>
                ) : (
                  "N/A"
                )}
              </Td>
              <Td width={30}>
                <ProductStatusTree
                  variant="tree"
                  branches={vulnerability.product_status}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};
