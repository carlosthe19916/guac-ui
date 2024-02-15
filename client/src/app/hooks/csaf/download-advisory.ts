import { saveAs } from "file-saver";
import {
  downloadAdvisoryById,
  downloadCveById,
  downloadSbomById,
} from "@app/api/rest";

export const useDownload = () => {
  const downloadAdvisory = (id: string, filename?: string) => {
    downloadAdvisoryById(id).then((response) => {
      saveAs(new Blob([response.data]), filename || `${id}.json`);
    });
  };

  const downloadSbom = (id: string, filename?: string) => {
    downloadSbomById(id).then((response) => {
      saveAs(new Blob([response.data]), filename || `${id}.json`);
    });
  };

  const downloadCve = (id: string, filename?: string) => {
    downloadCveById(id).then((response) => {
      saveAs(new Blob([response.data]), filename || `${id}.json`);
    });
  };

  return { downloadAdvisory, downloadSbom, downloadCve };
};
