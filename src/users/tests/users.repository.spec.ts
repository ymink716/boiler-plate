import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from "typeorm"
import { User } from 'src/users/infrastructure/entity/user.entity';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import { AppModule } from 'src/app.module';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { UsersRepository } from '../domain/repository/users.repository';
import { USERS_REPOSITORY } from 'src/common/constants/tokens.constant';

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
    usersRepository = app.get<UsersRepository>(USERS_REPOSITORY);
    dataSource = app.get<DataSource>(DataSource);

    setUpTestingAppModule(app);
    
    await app.init();
  });

  describe('findOneById()', () => {
    test('해당 id의 사용자 entity를 반환한다.', async () => {
      const user = await dataSource.manager.save(new User({ 
        email: "test@email.com",
        provider: UserProvider.GOOGLE,
        providerId: "providerId",
        name: "tester",
        picture: "pictureURL",
      }));

      const result = await usersRepository.findOneById(user.id);

      expect(result?.id).toBe(user.id);
      expect(result?.email).toBe("test@email.com");
      expect(result?.name).toBe("tester");
    });
  });

  describe('findByProviderId()', () => {
    test('해당 소셜 계정(providerId)에 해당하는 사용자 entity를 반환한다.', async () => {
      const user = await dataSource.manager.save(new User({ 
        email: "test@email.com",
        provider: UserProvider.GOOGLE,
        providerId: "providerId",
        name: "tester",
        picture: "pictureURL",
      }));

      const result = await usersRepository.findByProviderId(user.providerId);

      expect(result?.id).toBe(user.id);
      expect(result?.providerId).toBe("providerId");
    });
  });

  describe('save()', () => {
    test('DB에 사용자 정보를 저장하고, entity를 반환한다.', async () => {
      const user = await dataSource.manager.save(new User({ 
        email: "test@email.com",
        provider: UserProvider.GOOGLE,
        providerId: "providerId",
        name: "tester",
        picture: "pictureURL",
      }));

      const result = await usersRepository.save(user);

      expect(result).toBeInstanceOf(User);
      expect(await usersRepository.findOneById(result.id)).toEqual(user);
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
