import { useState } from "react";
import budgetsLimitApi from "../api/modules/budgets_limit";

export default function useBudgetsLimit() {
  const [loadingBudgetsLimit, setLoadingBudgetsLimit] = useState(false);

  const createBudgetsLimit = async (data) => {
    try {
      setLoadingBudgetsLimit(true);
      await budgetsLimitApi.create(data);
    } catch (err) {
      console.error("Thêm hạn mức thất bại", err);
    } finally {
      setLoadingBudgetsLimit(false);
    }
  };

  return {
    loadingBudgetsLimit,
    createBudgetsLimit,
  };
}
