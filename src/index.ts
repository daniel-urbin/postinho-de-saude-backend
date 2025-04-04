import { supabase } from './supabaseClient'

const testConnection = async () => {
    const { data, error } = await supabase.from('usuario').select('*');
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Data:', data);
    }
};

testConnection();