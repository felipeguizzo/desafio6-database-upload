import { getCustomRepository, getRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);

    const foundSameCategory = await categoriesRepository.findOne({
      where: { category },
    });

    let newCategory = new Category();
    if (!foundSameCategory) {
      newCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategory);
    }

    if (type === 'outcome') {
      const verifyTotal = (await transactionRepository.getBalance()).total;

      if (value > verifyTotal) {
        throw new AppError('Your total value is not sufficient', 400);
      }
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category: foundSameCategory || newCategory,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
