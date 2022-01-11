import { connection } from '../app/database/mysql';

/**
 * 搜索标签
 */
interface SearchTagsOptions {
  name?: any;
}

export const searchTags = async (options: SearchTagsOptions) => {
  //解构赋值
  const { name } = options;

  // SQL 参数
  const params: Array<any> = [`%${name}%`];

  //准备查询
  const statement = `
  SELECT
    tag.id,
    tag.name,
    (
      SELECT COUNT(post_tag.tagId)
      FROM post_tag
      WHERE tag.id = post_tag.tagId
    ) as totalPosts
    FROM
      tag
    WHERE
      tag.name LIKE ?
    ORDER BY
      totalPosts DESC
    LIMIT
      10
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, params);

  //提供数据
  return data as any;
};

/**
 * 搜索用户
 */
interface SearchUsersOptions {
  name?: any;
}

export const searchUsers = async (options: SearchUsersOptions) => {
  //解构赋值
  const { name } = options;

  // SQL 参数
  const params: Array<any> = [`%${name}%`];

  //准备查询
  const statement = `
  SELECT
    user.id,
    user.name,
    IF(
      COUNT(avatar.id), 1, NULL
    ) AS avatar,
    (
      SELECT COUNT(post.id)
      FROM post
      WHERE user.id = post.userId
    ) as totalPosts
     FROM 
        user
    LEFT JOIN avatar
      ON avatar.userId = user.id
    WHERE
      user.name LIKE ?
    GROUP BY
      user.id
    LIMIT
      10
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, params);

  //提供数据
  return data as any;
};

/**
 * 搜索相机
 */
interface SearchCamerasOptions {
  makeModel?: any;
}

export const searchCameras = async (options: SearchCamerasOptions) => {
  //解构赋值
  const { makeModel } = options;

  // SQL 参数
  const params: Array<any> = [`%${makeModel}%`];

  //品牌与型号
  const makeModelField = `JSON_EXTRACT(file.metadata, "$.Make", "$.Model" )`;

  //准备查询
  const statement = `
  SELECT
    ${makeModelField} as camera,
    COUNT(${makeModelField}) as totalPosts
  FROM
    file
  WHERE
    ${makeModelField} LIKE ? COLLATE utf8mb4_unicode_ci
  GROUP BY
    ${makeModelField}
  LIMIT
    10
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, params);

  //提供数据
  return data as any;
};

/**
 * 搜索镜头
 */
interface SearchLensOptions {
  makeModel?: any;
}

export const searchLens = async (options: SearchLensOptions) => {
  //解构赋值
  const { makeModel } = options;

  // SQL 参数
  const params: Array<any> = [`%${makeModel}%`];

  //品牌与型号
  const makeModelField = `JSON_EXTRACT(file.metadata, "$.LensMake", "$.LensModel" )`;

  //准备查询
  const statement = `
  SELECT
    ${makeModelField} as lens,
    COUNT(${makeModelField}) as totalPosts
  FROM
    file
  WHERE
    ${makeModelField} LIKE ? COLLATE utf8mb4_unicode_ci
  GROUP BY
    ${makeModelField}
  LIMIT
    10
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, params);

  //提供数据
  return data as any;
};
