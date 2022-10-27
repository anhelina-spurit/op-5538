function getWishlistId() {
  let result = null;
  for (let i = decodeURIComponent(document.cookie).split(';'), t = 0; t < i.length; t++) {
    if (i[t].includes('wishlist_id=')) {
      result = i[t].substring(1).substring('wishlist_id='.length, i[t].substring(1).length);
    }
  }
  return result;
}

export { getWishlistId };
