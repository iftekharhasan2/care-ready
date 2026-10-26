// Rules for test orders. The second appointment opens only when every required test has a report.
export const requiredItems = (order) => order.items.filter((it) => it.required);
export const reportedCount = (order) => requiredItems(order).filter((it) => it.status === 'reported').length;
export const missingTests = (order) => requiredItems(order).filter((it) => it.status !== 'reported');
export const testsReady = (order) => missingTests(order).length === 0;
