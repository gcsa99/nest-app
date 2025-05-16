import { FakeHasher } from '@test/cryptography/fake-hasher';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository';
import { CreateUserUseCase } from './create-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able to create a user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '12345678',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    });
  });
  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '12345678',
    });
    const hashedPassword = await fakeHasher.hash('12345678');

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    });
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
  });
});
