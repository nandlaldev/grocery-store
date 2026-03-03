const carts = new Map();

export function getCart(userId) {
  if (!carts.has(userId)) carts.set(userId, []);
  return carts.get(userId);
}

export function clearCart(userId) {
  carts.set(userId, []);
}
