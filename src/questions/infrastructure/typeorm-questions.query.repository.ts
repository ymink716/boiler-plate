export class TypeormQuestionsQueryRepository {
    async findOneByIdJoinUser(id: number): Promise<Question | null> {
        const questionEntity = await this.questionRepository.findOne({ 
          where: { id },
          relations: ['user'],
        });
    
        if (!questionEntity) {
          return null;
        }
    
        return new FindOneByIdJoinUserDto();
      }
}