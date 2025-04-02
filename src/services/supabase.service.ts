import supabase from '../supabase.config';

const getDados = async () => {
  const { data, error } = await supabase
    .from('tabela')
    .select('*');

  if (error) {
    console.error(error);
  } else {
    return data;
  }
};

export { getDados };