import budgetsLimitApi from '../api/modules/budgets_limit';

export default function useBudgetsLimit() {

  const createBudgetsLimit = async (data) => {
    await budgetsLimitApi.create(data);
  };

  return {
    createBudgetsLimit,
  };
}