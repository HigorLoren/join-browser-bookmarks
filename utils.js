const { parseByPath } = require('bookmark-file-parser');

exports.distinctBookmarks = (filesPath) => {
  const uniqueBookmarks = [];
  const uniqueUrls = [];
  
  const recursive = (fav) => {
    if (fav.children?.length > 0) {
      fav.children.forEach(recursive);
    } else {
      if (!uniqueUrls.includes(fav.href)) {
        uniqueUrls.push(fav.href);
  
        uniqueBookmarks.push({
          name: fav.name,
          href: fav.href,
        });
      }
    }
  };

  filesPath.forEach((filePath) => {
    parseByPath(filePath).forEach(recursive);
  });

  return uniqueBookmarks;
};

exports.sortDumb = (bookmarks) => (
  bookmarks.sort((fav_a, fav_b) => {
    const fav_a_href = new URL(fav_a.href);
    const fav_b_href = new URL(fav_b.href);
  
    if (fav_a_href.host.substring(0, 1) < fav_b_href.host.substring(0, 1)) {
      return -1;
    } else if (fav_a_href.host.substring(0, 1) > fav_b_href.host.substring(0, 1)) {
      return 1;
    } else {
      return 0;
    }
  })
);

exports.groupBookmarks = (bookmarks) => {
  const hash = {};
  const bookmarksGrouped = [];

  bookmarks.forEach((bookmark) => {
    const url = new URL(bookmark.href);

    if (!hash[url.hostname]) {
      hash[url.hostname] = [];
      bookmarksGrouped.push(hash[url.hostname]);
    }
    hash[url.hostname].push(bookmark);
  });

  return bookmarksGrouped;
}

exports.foldersFirst = (bookmarks) => (
  bookmarks.sort((a, b) => {
    if (a.length > b.length) {
      return -1;
    } else if (a.length < b.length) {
      return 1;
    } else {
      return 0;
    }
  })
);
