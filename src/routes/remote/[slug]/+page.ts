import {error} from "@sveltejs/kit";

export const load = ({ params }: {params: { slug: string }}) => {

  if (!params.slug) return error(404, 'Not found')
  return {
    id: params.slug,
  }
};