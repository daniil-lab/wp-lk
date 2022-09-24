import axios from "Utils/Axios";
import { API_URL } from "Utils/Config";
import { CategoryModel, ColorType, IconType } from "Models/CategoryModel";

const SOMETHING_WENT_WRONG = "Что-то пошло не так";

export default class CategoryRepository {
  constructor() {}

  async editCategory(
    categoryId: string,
    name: string,
    description: string,
    icon: string,
    color: string,
    categoryLimit: number,
    forEarn: boolean,
    forSpend: boolean
  ): Promise<boolean | undefined> {
    console.log({
      categoryId,
      name,
      description,
      icon,
      color,
      categoryLimit,
      forEarn,
      forSpend,
    });
    try {
      const res = await axios.patch(`${API_URL}api/v1/category/${categoryId}`, {
        name,
        description,
        icon,
        color,
        categoryLimit,
        forEarn,
        forSpend,
      });
      if (res.status === 200) return true;
    } catch (error: any) {
      console.log(error.response);
      throw new Error();
    }
  }

  async addCategory(userId, params): Promise<boolean | undefined> {
    try {
      const res = await axios.post(`${API_URL}api/v1/category/`, {
        name: params.name,
        icon: params.icon.id,
        color: params.color.systemName,
        userId: userId,
        categoryLimit: parseInt(params.categoryLimit),
        forEarn: params.forEarn,
        forSpend: params.forSpend,
      });
      if (res.status === 201) return true;
    } catch (error: any) {
      throw new Error();
    }
  }

  async getCategories(): Promise<CategoryModel[] | undefined> {
    try {
      const res = await axios.get(`${API_URL}api/v1/category/`);
      if (res.data.status === 200) {
        return res.data.data;
      }
    } catch (error: any) {
      throw new Error();
    }
  }

  async getCategoryColors(): Promise<ColorType[] | undefined> {
    try {
      const res = await axios.get(`${API_URL}api/v1/category/colors`);
      if (res.data.status === 200) {
        return res.data.data;
      }
    } catch (error: any) {
      throw new Error();
    }
  }

  async getCategoryIcons(): Promise<IconType[] | undefined> {
    try {
      const res = await axios.get(`${API_URL}api/v1/image/tag/CATEGORY_ICON`);
      if (res.data.status === 200) {
        return res.data.data;
      }
    } catch (error: any) {
      throw new Error();
    }
  }

  async removeCategory(categoryId: string): Promise<boolean | undefined> {
    try {
      const res = await axios({
        method: "DELETE",
        url: `${API_URL}api/v1/category/${categoryId}`,
      });
      if (res.data.status === 200) {
        return res.data.data;
      }
    } catch (error: any) {
      throw new Error();
    }
  }

  async changeLimit(config): Promise<boolean | undefined> {
    try {
      const res = await axios({
        method: "patch",
        url: `${API_URL}api/v1/category/${config.categoryId}/`,
        data: {
          categoryLimit: config.categoryLimit,
        },
      });
      if (res.status === 200) return true;
    } catch (error: any) {
      throw new Error();
    }
  }

  async makeFavorite(categoryId: string): Promise<CategoryModel> {
    try {
      const res = await axios({
        method: "patch",
        url: `${API_URL}api/v1/category/favorite`,
        data: { categoryId },
      });
      if (res.status !== 200) throw new Error(SOMETHING_WENT_WRONG);
      return res.data;
    } catch (error: unknown) {
      throw error instanceof Error ? error : new Error(SOMETHING_WENT_WRONG);
    }
  }

  async removeFromFavorite(
    categoryId: string
  ): Promise<{
    data: CategoryModel;
    message: string;
    status: number;
    advices: Array<string>;
  }> {
    try {
      const res = await axios({
        method: "delete",
        url: `${API_URL}api/v1/category/favorite/${categoryId}`,
      });
      if (res.status !== 200) throw new Error(SOMETHING_WENT_WRONG);
      return res.data;
    } catch (error) {
      throw error instanceof Error ? error : new Error(SOMETHING_WENT_WRONG);
    }
  }
}
