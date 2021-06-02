const fs = require('fs');
const utils = require('./utils.js');

const TITLE_OF_EXPORT = 'Bookmarks';
const OUTPUT_FILE_PATH = process.argv[2];

let filePaths = process.argv.slice(3);

let bookmarks = utils.distinctBookmarks(filePaths);
bookmarks = utils.sortDumb(bookmarks);
bookmarks = utils.groupBookmarks(bookmarks);
bookmarks = utils.foldersFirst(bookmarks);

// Clear the output file
fs.writeFileSync(OUTPUT_FILE_PATH, '');

// "Alias" for appending data to the output file
const appendToHtml = (data) => fs.appendFileSync(OUTPUT_FILE_PATH, data + '\n');

// Required header for NETSCAPE Bookmarks
// NOTE: Only supports chrome-based browsers? 
appendToHtml('<!DOCTYPE NETSCAPE-Bookmark-file-1>')
appendToHtml('<!-- This is an automatically generated file.')
appendToHtml('     It will be read and overwritten.')
appendToHtml('     DO NOT EDIT! -->')
appendToHtml('<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">')
appendToHtml(`<TITLE>${TITLE_OF_EXPORT}</TITLE>`)
appendToHtml(`<H1>${TITLE_OF_EXPORT}</H1>`)

bookmarks.forEach((bookmarksGroup) => {
  // If the group is more than one element add to the group folder
  if (bookmarksGroup.length > 1) {
    appendToHtml(`    <DT><H3>${new URL(bookmarksGroup[0].href).hostname}</H3>`);
    appendToHtml(`    <DL><p>`);

    bookmarksGroup.forEach((bookmark) => {
      appendToHtml(`      <DT><A HREF="${bookmark.href}">${bookmark.name}</A>`);
    });

    appendToHtml('    </DL><p>');
  // Or write in the root folder
  } else {
    appendToHtml(`    <DT><A HREF="${bookmarksGroup[0].href}">${bookmarksGroup[0].name}</A>`);
  }
});

appendToHtml('  </DL><p>');
appendToHtml('</DL><p>');
