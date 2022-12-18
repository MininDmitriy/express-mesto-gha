const message = {
  errorNotFound: {
    userId: 'Пользователь по указанному _id не найден',
    cardId: 'Карточка с указанным _id не найдена',
    page: 'Страница не найдена',
  },
  errorForbidden: 'Данное действия от текущего пользователя запрещено',
  errorIncorrectDate: {
    login: 'Неправильные почта и пароль',
    token: 'С токеном что-то не так',
    authorization: 'Необходима авторизация',
  },
  success: {
    cardDelete: 'Карточка успешно удалена',
    likeCard: 'Постановка лайка прошло успешно',
    dislikeCard: 'Снятие лайка прошло успешно',
    login: 'Успешный вход в приложение',
  },
};

const SUCCESS = 200;
const CREATED = 201;

module.exports = { message, SUCCESS, CREATED };
