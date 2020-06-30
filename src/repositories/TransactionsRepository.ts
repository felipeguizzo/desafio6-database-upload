import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find();

    const sumIncome = allTransactions
      .filter(x => x.type === 'income')
      .map(x => x.value)
      .reduce((acc, val) => acc + val, 0);

    const filterOutcome = allTransactions.filter(x => x.type === 'outcome');

    let sumOutcome = 0;
    if (filterOutcome.length > 0) {
      sumOutcome = filterOutcome
        .map(x => x.value)
        .reduce((acc, val) => acc + val, 0);
    }
    const sumTotal = sumIncome - sumOutcome;

    return { income: sumIncome, outcome: sumOutcome, total: sumTotal };
  }
}

export default TransactionsRepository;
