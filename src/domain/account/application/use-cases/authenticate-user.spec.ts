import { FakeHasher } from '@test/cryptography/fake-hasher';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository';
import { AuthenticateUserUseCase } from './authenticate-user';
import { FakeEncrypt } from '@test/cryptography/fake-encrypt';
import { makeUser } from '@test/factories/make-user';
import { access } from 'fs';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypt;
let sut: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypt();
    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate a user', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('12345678'),
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '12345678',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
