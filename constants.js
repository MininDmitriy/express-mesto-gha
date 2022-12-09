const message = {
  errorInternalServer: 'На сервере произошла ошибка',
  errorNotFound: {
    userId: 'Пользователь по указанному _id не найден',
    cardId: 'Карточка с указанным _id не найдена',
    page: 'Страница не найдена',
  },
  errorIncorrectDate: {
    userId: 'Некорректно передан _id пользователя',
    dateUser: 'Переданы некорректные данные при создании пользователя',
    updateDateUser: 'Переданы некорректные данные при обновлении профиля',
    updateAvatarUser: 'Переданы некорректные данные при обновлении аватара',
    dateCard: 'Переданы некорректные данные при создании карточки',
    cardId: 'Переданы некорректный _id удаляемой карточки',
    likeCard: 'Переданы некорректные данные для постановки лайка',
    dislikeCard: 'Переданы некорректные данные для снятия лайка',
  },
  success: {
    cardDelete: 'Карточка успешно удалена',
    likeCard: 'Постановка лайка прошло успешно',
    dislikeCard: 'Снятие лайка прошло успешно',
  },
};

const errors = {
  success: 200,
  created: 201,
  errorNotFound: 404,
  errorIncorrectDate: 400,
  errorInternalServer: 500,
};

module.exports = { message, errors };
