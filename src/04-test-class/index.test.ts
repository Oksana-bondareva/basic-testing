// Uncomment the code below and write your tests
import { getBankAccount, InsufficientFundsError, SynchronizationFailedError, TransferFailedError } from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const balance = getBankAccount(10);
    expect(balance.getBalance()).toBe(10);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const balance = getBankAccount(10);
    expect(() => balance.withdraw(20)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const balance1 = getBankAccount(10);
    const balance2 = getBankAccount(20);
    expect(() => balance1.transfer(15, balance2)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const balance = getBankAccount(10);
    expect(() => balance.transfer(5, balance)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const balance = getBankAccount(10);
    balance.deposit(5);
    expect(balance.getBalance()).toBe(15);
  });

  test('should withdraw money', () => {
    const balance = getBankAccount(10);
    balance.withdraw(5);
    expect(balance.getBalance()).toBe(5);
  });

  test('should transfer money', () => {
    const balance1 = getBankAccount(10);
    const balance2 = getBankAccount(20);
    balance1.transfer(5, balance2);
    expect(balance1.getBalance()).toBe(5);
    expect(balance2.getBalance()).toBe(25);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const balance1 = getBankAccount(10);
    const balance2 = await balance1.fetchBalance();
    if (balance2 !== null) {
      expect(typeof balance2).toBe('number');
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const balance = getBankAccount(10);
    jest.spyOn(balance, 'fetchBalance').mockResolvedValue(15);
    await balance.synchronizeBalance();
    expect(balance.getBalance()).toBe(15);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const balance = getBankAccount(10);
    jest.spyOn(balance, 'fetchBalance').mockResolvedValue(null);
    await expect(balance.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
  });
});
