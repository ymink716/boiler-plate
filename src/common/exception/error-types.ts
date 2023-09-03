export const UnauthorizedUser = { 
  name: 'UnauthorizedUser', 
  message: '인증되지 않은 사용자입니다.', 
}

export const InvalidToken = {
  name: 'TokenHasExpired',
  message: '만료되거나 유효하지 않은 토큰입니다.',
}

export const UserNotExist = {
  name: 'UserNotExist',
  message: '해당 사용자를 찾을 수 없습니다.',
}

export const QuestionNotFound = {
  name: 'QuestionNotFound',
  message: '해당 질문을 찾을 수 없습니다.',
}

export const IsNotQuestionWriter = {
  name: 'IsNotQuestionWriter',
  message: '질문 작성자가 아니면 접근할 수 없습니다.',
}

export const CommentNotFound = {
  name: 'CommentNotFound',
  message: '해당 답변을 찾을 수 없습니다.',
}

export const IsNotCommentor = {
  name: 'IsNotQuestionWriter',
  message: '답변 작성자가 아니면 접근할 수 없습니다.',
}

export const QuestionAlreadyLiked = {
  name: 'QuestionsAlreadyLiked',
  message: '이미 좋아요를 누른 질문입니다.'
}

export const CommentAlreadyLiked = {
  name: 'CommentAlreadyLiked',
  message: '이미 좋아요를 누른 답변입니다.'
}
