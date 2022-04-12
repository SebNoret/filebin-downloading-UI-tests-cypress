/// <reference types="cypress"/>

const newFileName = "fileToUpload";
const baseUrl = "https://filebin.net";
const file = "cypress-logo.png";
const downloadDirectory = "myDownloads";

/**
 *
 * Helper functions
 *
 * */

function changeFileExtension(extension) {
  return file.replace(".png", `.${extension}`);
}

function uploadAndDownloadTest(fileExtension) {
  cy.get("#fileField").attachFile({
    filePath: file,
    fileName: newFileName,
  });

  cy.contains(newFileName).should("be.visible");
  cy.get('[data-bs-target="#modalArchive"]').click();
  cy.contains("Select archive format to download:").should("be.visible");
  cy.contains(fileExtension).should("be.visible");

  cy.contains(fileExtension)
    .invoke("attr", "href")
    .then((link) => {
      cy.downloadFile(
        `${baseUrl}${link}`,
        downloadDirectory,
        changeFileExtension(fileExtension)
      );
      cy.readFile(`${downloadDirectory}/${changeFileExtension(fileExtension)}`);
    });
  cy.get(
    "#modalArchive > .modal-dialog > .modal-content > .modal-footer > .btn"
  ).click();
  cy.contains(fileExtension).should("not.be.visible");
}

/***
 *
 *
 *  Test suite
 */
describe("file download test", function () {
  beforeEach(() => {
    cy.visit(baseUrl);
  });
  afterEach(() => {
    cy.clearCookies();
  });
  it("should upload a file on server and re-download it as a Zip file ", function () {
    uploadAndDownloadTest("Zip");
  });

  it("should upload a file on server and re-download it as a Tar file ", function () {
    uploadAndDownloadTest("Tar");
  });
});
