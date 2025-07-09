module.exports = {
  visit: jest.fn((tree, type, handler) => {
    // Simple mock that doesn't actually traverse the tree
    // Just to prevent errors during testing
  }),
  CONTINUE: 0,
  EXIT: 1,
  SKIP: 2,
};