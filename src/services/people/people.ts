import axios from 'redaxios';

import { tmdbBaseUrl } from '@/services/config';
import { PersonInfoSchema } from '@/types/people.schemas';

export class PersonNotFoundError extends Error {}

const apiKey = import.meta.env.VITE_APIKEY;
axios.defaults.baseURL = tmdbBaseUrl;

const paramOptions = {
   personInfo: (personId: number) =>
      `/person/${personId}${apiKey}&language=en-US&append_to_response=combined_credits,external_ids`,
};

export const fetchPerson = async (personId: number) => {
   return axios
      .get(paramOptions.personInfo(personId))
      .then((res) => PersonInfoSchema.parse(res.data))
      .catch((err) => {
         if (err.status === 404) {
            throw new PersonNotFoundError(
               `Person with id "${personId}" not found!`
            );
         }
         throw err;
      });
};
