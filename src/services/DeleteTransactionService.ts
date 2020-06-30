import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const deleteResult = await transactionRepository.delete({ id });

    if (!(deleteResult.affected && deleteResult.affected > 0)) {
      throw new AppError('Any transaction found to be deleted');
    }
  }
}

export default DeleteTransactionService;
