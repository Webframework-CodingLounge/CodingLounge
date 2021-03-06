/**
 * ./models/comment.js
 */

const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      comment: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },

    }, {
      sequelize,
      timestamps: false,
      modelName: 'Comment',
      tableName: 'comment',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_0900_ai_ci',
    });
  }

  static associate(db) {
    db.Comment.belongsTo(db.User, { 
      foreignKey: 'commenter', targetKey: 'id' 
    });

    db.Comment.belongsTo(db.Post, { 
      foreignKey: 'posts_id', targetKey: 'id' 
    });

  }
};
  