import { supabase } from './supabaseClient';

export async function getVendedores() {
  const { data, error } = await supabase.from('Vendedor').select('*');
  if (error) throw error;
  return data;
}

export async function getVentasPorFecha(fechaInicio, fechaFin) {
  const { data, error } = await supabase
    .from('Ventas')
    .select('*')
    .gte('fecha_venta', fechaInicio)
    .lte('fecha_venta', fechaFin);
  if (error) throw error;
  return data;
}

export async function getReglas() {
  const { data, error } = await supabase.from('Reglas').select('*');
  if (error) throw error;
  return data;
} 