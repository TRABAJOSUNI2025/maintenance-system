-- Crear rol si no existe
INSERT INTO rol (nombrerol) VALUES ('ADMINISTRADOR') ON CONFLICT DO NOTHING;
INSERT INTO rol (nombrerol) VALUES ('SUPERVISOR') ON CONFLICT DO NOTHING;
INSERT INTO rol (nombrerol) VALUES ('OPERARIO') ON CONFLICT DO NOTHING;

-- Obtener IDs
\set admin_rol_id (SELECT idrol FROM rol WHERE nombrerol = 'ADMINISTRADOR' LIMIT 1)
\set admin_emp_id (SELECT idempleado FROM empleado WHERE dni = '11111111' LIMIT 1)

-- Crear relación si no existe
INSERT INTO empleadorol (idempleado, idrol) 
SELECT :admin_emp_id, :admin_rol_id 
WHERE NOT EXISTS (
  SELECT 1 FROM empleadorol WHERE idempleado = :admin_emp_id AND idrol = :admin_rol_id
);

SELECT 'Setup completado' as resultado;
