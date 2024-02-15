import { Skeleton } from "@patternfly/react-core";
import React from "react";
import { NavLink } from "react-router-dom";

import {
    Td as PFTd
} from "@patternfly/react-table";

import {
    ConditionalTableBody,
    useClientTableBatteries,
} from "@mturley-latest/react-table-batteries";

import { SbomIndexed } from "@app/api/models";
import { useFetchPackageRelatedProducts } from "@app/queries/packages";
import { useFetchSbomIndexedByUId } from "@app/queries/sboms";
import { AxiosError } from "axios";

interface RelatedProductsProps {
  packageId: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  packageId,
}) => {
  const { relatedProducts, isFetching, fetchError } =
    useFetchPackageRelatedProducts(packageId);

  const tableControls = useClientTableBatteries({
    persistTo: "sessionStorage",
    idProperty: "sbom_uid",
    items: relatedProducts?.related_products || [],
    isLoading: isFetching,
    columnNames: {
      name: "Name",
      version: "Version",
      supplier: "Supplier",
      dependency: "Dependency",
    },
    hasActionsColumn: true,
    filter: {
      isEnabled: true,
      filterCategories: [],
    },
    sort: {
      isEnabled: true,
      sortableColumns: [],
    },
    pagination: { isEnabled: true },
    expansion: {
      isEnabled: false,
      variant: "single",
      persistTo: "state",
    },
  });

  const {
    currentPageItems,
    numRenderedColumns,
    components: {
      Table,
      Thead,
      Tr,
      Th,
      Tbody,
      Td,
      Toolbar,
      FilterToolbar,
      PaginationToolbarItem,
      Pagination,
    },
    expansion: { isCellExpanded, setCellExpanded },
  } = tableControls;

  return (
    <>
      {/* <Toolbar>
        <ToolbarContent>
          <FilterToolbar id="related-products-toolbar" />
          <PaginationToolbarItem>
            <Pagination
              variant="top"
              isCompact
              widgetId="related-products-pagination-top"
            />
          </PaginationToolbarItem>
        </ToolbarContent>
      </Toolbar> */}

      <Table
        aria-label="Related products table"
        className="vertical-aligned-table"
      >
        <Thead>
          <Tr isHeaderRow>
            <Th columnKey="name" />
            <Th columnKey="version" />
            <Th columnKey="supplier" />
            <Th columnKey="dependency" />
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={relatedProducts?.related_products?.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item.sbom_uid} isExpanded={isCellExpanded(item)}>
                <Tr item={item} rowIndex={rowIndex}>
                  <TdWrapper sbom_uid={item.sbom_uid}>
                    {(sbom, isFetching, fetchError) => (
                      <>
                        {isFetching ? (
                          <PFTd width={100} colSpan={4}>
                            <Skeleton />
                          </PFTd>
                        ) : (
                          <>
                            <Td width={45} columnKey="name">
                              <NavLink to={`/sboms/${sbom?.id}`}>
                                {sbom?.name}
                              </NavLink>
                            </Td>
                            <Td
                              width={15}
                              modifier="truncate"
                              columnKey="version"
                            >
                              {sbom?.version}
                            </Td>
                            <Td
                              width={25}
                              modifier="truncate"
                              columnKey="supplier"
                            >
                              {sbom?.supplier}
                            </Td>
                            <Td
                              width={15}
                              modifier="truncate"
                              columnKey="dependency"
                            >
                              {/* // TODO */}
                              Direct
                            </Td>
                          </>
                        )}
                      </>
                    )}
                  </TdWrapper>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <Pagination
        variant="bottom"
        isCompact
        widgetId="related-products-pagination-bottom"
      />
    </>
  );
};

const TdWrapper = ({
  sbom_uid,
  children,
}: {
  sbom_uid: string;
  children: (
    sbom: SbomIndexed | undefined,
    isFetching: boolean,
    fetchError: AxiosError
  ) => React.ReactNode;
}) => {
  const { sbom, isFetching, fetchError } = useFetchSbomIndexedByUId(sbom_uid);
  return children(sbom, isFetching, fetchError);
};
