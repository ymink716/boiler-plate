import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from "typeorm"
import { User } from 'src/users/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { AppModule } from 'src/app.module';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { UsersRepository } from '../users.repository';

describe('UsersRepository', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    usersRepository = app.get<UsersRepository>('USERS_REPOSITORY');
    dataSource = app.get<DataSource>(DataSource);

    setUpTestingAppModule(app);
    
    await app.init();
  });

  describe('findOneById()', () => {
    test('user entity를 리턴한다', async () => {
      const user = await dataSource.manager.save(new User({ 
        email: "test@email.com",
        provider: UserProvider.GOOGLE,
        providerId: "providerId",
        name: "tester",
        picture: "pictureURL",
      }));

      const result = await usersRepository.findOneById(user.id);

      expect(result?.email).toBe("test@email.com");
      expect(result?.name).toBe("tester");
    });
  });

  describe('findByProviderId()', () => {
    test('user entity를 리턴한다', async () => {
      const user = await dataSource.manager.save(new User({ 
        email: "test@email.com",
        provider: UserProvider.GOOGLE,
        providerId: "providerId",
        name: "tester",
        picture: "pictureURL",
      }));

      const result = await usersRepository.findByProviderId(user.providerId);

      expect(result?.email).toBe("test@email.com");
      expect(result?.name).toBe("tester");
    });
  });

  describe('save()', () => {
    test('save된 user entity를 리턴한다.', async () => {
      const user = await dataSource.manager.save(new User({ 
        email: "test@email.com",
        provider: UserProvider.GOOGLE,
        providerId: "providerId",
        name: "tester",
        picture: "pictureURL",
      }));

      const result = await usersRepository.save(user);

      expect(result?.email).toBe("test@email.com");
      expect(result?.name).toBe("tester");
    });
  });

  afterEach(async () => {
    dataSource.manager.delete(User, {});
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });
});
