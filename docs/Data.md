### **1) Cliente**

| Campo      | Tipo     |
| ---------- | -------- |
| dniCliente | int(8)   |
| nombre     | char(20) |
| apePaterno | char(20) |
| apeMaterno | char(20) |
| telefono   | char(9)  |
| correo     | char(40) |

🔑 **PK:** codCliente
🔗 **Relaciones:**

- 1 Cliente **tiene N** Cuentas (CuentaCliente)

---

### **2) Vehículo**

| Campo            | Tipo     |
| ---------------- | -------- |
| codVehiculo      | char(8)  |
| placa            | char(6)  |
| marca            | char(20) |
| modelo           | char(20) |
| fechaFabricacion | date     |
| kilometraje      | decimal  |

🔑 **PK:** codVehiculo
🔗 **Relaciones:**

- 1 Vehículo **pertenece 1** CuentaCliente

---

### **3) CuentaCliente**

| Campo               | Tipo    |
| ------------------- | ------- |
| codCuentaCliente    | char(8) |
| dniCliente          | char(8) |
| codVehiculo         | char(8) |
| totalMantPendiente  | int(8)  |
| totalMantCancelados | int(5)  |
| totalMatRealizados  | int(5)  |

🔑 **PK:** codCuentaCliente
🔑 **FK:** dniCliente->Cliente(dniCliente)
🔑 **PK:** codVehicuo->Vehiculo(codCuentaCliente)

🔗 **Relaciones:**

- Vehiculo(1:1)
- Cliente(N:1)
- MovimientoVenta(1:N)

---

### **4) MovimientoVenta**

| Campo            | Tipo          |
| ---------------- | ------------- |
| canal            | int(1)        |
| corr             | int(5)        |
| codCuentaCliente | char(8)       |
| codTicket        | char(8)       |
| monto            | decimal(10,2) |
| fecha            | date          |
| hora             | time          |
| estado           | int           |

🔑 **PK:** canal
🔑 **PK:** corr
🔑 **FK:** codCuentaCliente → CuentaCliente(codCuentaCliente)
🔑 **FK:** codTicket → Ticket(codTiket)

🔗 **Relaciones:**

- CuentaCliente(N:1)
- Ticket(1:1)

---

### **5) Ticket**

| Campo            | Tipo    |
| ---------------- | ------- |
| codTicket        | char(8) |
| codMantenimiento | char(8) |
| codSupervisor    | char(8) |
| codLoteTicket    | char(8) |
| fecha            | date    |
| horaIniEstimada  | time    |
| horaFinEstimada  | time    |
| estado           | char(1) |

🔑 **PK:** codTicket
🔑 **FK:** codMantenimiento → Matenimientos(codMantenimiento)
🔑 **FK:** codSupervisor → Supervisor(dniSupervisor)
🔑 **FK:** codLoteTicket → LoteTicket(codLoteTicket)

🔗 **Relaciones:**

- MovimientoVenta(1:1)
- Mantenimiento(1:1)
- LoteTicket(N:1)
- Supervisor(N:1)
- AsignaOperario(1:N)
- Rampa(1:N)

---

### **6) LoteTicket**

| Campo                  | Tipo    |
| ---------------------- | ------- |
| codLoteTicket          | char(8) |
| totalTiketsGenerados   | int(6)  |
| totalTicketsAsignados  | int(6)  |
| totalTiketsDisponibles | int(6)  |
| totalTicketsCancelados | int(6)  |
| fechaGeneracion        | date    |
| fechaVencimiento       | date    |

🔑 **PK:** codLoteTicket
🔗 **Relaciones:**

- Ticket(1:N)

---

### **7) Mantenimientos**

| Campo            | Tipo          |
| ---------------- | ------------- |
| codMantenimiento | char(8)       |
| codTicket        | char(8)       |
| codServicio      | char(8)       |
| horaInicioReal   | time          |
| horaFinReal      | time          |
| fechaRealiza     | date          |
| monto            | decimal(10,2) |
| observaciones    | char(8)       |
| estado           | int(1)        |

🔑 **PK:** codMantenimiento
🔑 **FK:** codTicket → Ticket(codTicket)
🔑 **FK:** codServicio → CatalogoServicios(codServicio)
🔗 **Relaciones:**

- RepuestoUsado(1:N)
- CatalogoServicios(N:1)

---

### **8) CatalogoServicios**

| Campo              | Tipo          |
| ------------------ | ------------- |
| codServicio        | char(8)       |
| descripcion        | char(75)      |
| marca              | char(20)      |
| modelo             | char(30)      |
| tipoMantenimiento  | char(30)      |
| kilometrajeInicial | int(6)        |
| kilometrajeFinal   | int(6)        |
| tarifa             | decimal(10,2) |
| duracion           | int(4)        |
| codProtocolo       | int(8)        |

🔑 **PK:** codServicio
🔑 **FK:** codProtocolo->Protocolo(codProtocolo)
🔗 **Relaciones:**

- Mantenimientos(1:N)
- Protocolo(N:1)

---

### **9) Protocolo**

| Campo            | Tipo      |
| ---------------- | --------- |
| codProtocolo     | int(8)    |
| nombre           | char(30)  |
| descripcion      | char(100) |
| duracionEstimada | int(5)    |

🔑 **PK:** codProtocolo
🔗 **Relaciones:**

- CatalogoServicicos(1:N)

---

### **10) RepuestoUsado**

| Campo            | Tipo    |
| ---------------- | ------- |
| codRepuestoUsado | char(8) |
| codRepuesto      | char(8) |
| codMantenimiento | char(8) |
| cantidadUsasa    | int(8)  |

🔑 **PK:** codRepuestoUsado
🔑 **FK:** codRepuesto->Repuesto(codRepuesto)
🔑 **FK:** codMatenimiento->Mantenimiento(codMantenimiento)

🔗 **Relaciones:**

- Mantenimientos(N:1)
- Repuesto(N:1)

---

### **11) Repuesto**

| Campo                | Tipo      |
| -------------------- | --------- |
| codRepuesto          | char(8)   |
| codCategoriaRepuesto | char(8)   |
| nombre               | char(20)  |
| descripcion          | char(100) |
| fechaAdquisicion     | date      |
| fechaCaducidad       | date      |
| stock                | int(8)    |

🔑 **PK:** codRepuesto
🔑 **FK:** codCategoriaRepuesto->CategoriaRepuesto(codCategoriaRepuesto)

🔗 **Relaciones:**

- RepuestoUsado(1:N)
- CategoriaRepuesto(N:1)

---

### **12) CategoriaRepuesto**

| Campo                | Tipo     |
| -------------------- | -------- |
| codCategoriaRepuesto | char(8)  |
| nombre               | char(20) |
| descripcion          | char(80) |

🔑 **PK:** codCategoriaRepuesto

🔗 **Relaciones:**

- Repuesto(1:N)

---

### **13) Supervisor**

| Campo                 | Tipo     |
| --------------------- | -------- |
| dniSupervisor         | char(8)  |
| nombre                | char(20) |
| telefono              | int(9)   |
| correo                | char(30) |
| totalMantSupervisados | int(6)   |
| totalMantFallidos     | int(6)   |
| totalMantCancelados   | int(6)   |
| estado                | char(1)  |

## 🔑 **PK:** codSupervisor

🔗 **Relaciones:**

- Ticket(1:N)
- DispSupervisor(1:N)

---

### **14) DispSupervisor**

| Campo             | Tipo    |
| ----------------- | ------- |
| codDispSupervisor | char(8) |
| dniSupervisor     | char(8) |
| codHorarioDisp    | char(8) |

🔑 **PK:** codDispSupervisor
🔑 **FK:** dniSupervisor->Supervisor(dniSupervisor)
🔑 **FK:** codHorarioDisp ->HorarioDisp(codHorarioDisp)

🔗 **Relaciones:**

- Supervisor(N:1)
- HorarioDisp(N:1)

---

### **15) HorarioDisp**

| Campo          | Tipo    |
| -------------- | ------- |
| codHorarioDisp | char(8) |
| fecha          | date    |
| horaInicio     | time    |
| horaFin        | time    |

🔑 **PK:** CodHorarioDisp

🔗 **Relaciones:**

- DispSupervisor(1:N)
- DispOperario(1:N)
- DispRampa(1:N)

---

### **16) DispOperario**

| Campo           | Tipo    |
| --------------- | ------- |
| codDispOperario | char(8) |
| dniOperario     | char(8) |
| codHorarioDisp  | char(8) |

🔑 **PK:** codDispOperario
🔑 **FK:** dniSupervisor->Operario(dniOperario)
🔑 **FK:** codHorarioDisp ->HorarioDisp(codHorarioDisp)

🔗 **Relaciones:**

- Operario(N:1)
- HorarioDisp(N:1)

---

### **17) Operario**

| Campo               | Tipo     |
| ------------------- | -------- |
| codOperario         | char(8)  |
| nombre              | char(20) |
| telefono            | int(9)   |
| correo              | char(30) |
| totalMantRealizados | int(6)   |
| totalMantFallidos   | int(6)   |
| totalMantCancelados | int(6)   |
| especialidad        | int(2    |
| estado              | int(1)   |

🔑 **PK:** codOperario
🔗 **Relaciones:**

- AsignaOperario(1:N)
- DispOperario(1:N)

---

### **18) AsignarOperario**

| Campo              | Tipo    |
| ------------------ | ------- |
| codOperarioxTicket | char(8) |
| dniOperario        | char(8) |
| codTicket          | char(8) |

🔑 **PK:** codOperarioxTicket
🔑 **FK:** dniOperario → Operario(dniOperario)
🔑 **FK:** codTicket->Ticket(codTicket)

🔗 **Relaciones:**

- Operario(N:1)
- Ticket(N:1)

---

### **19) DispOperario**

| Campo          | Tipo    |
| -------------- | ------- |
| codDispRampa   | char(8) |
| codRampa       | char(8) |
| codHorarioDisp | char(8) |

🔑 **PK:** codDispRampa
🔑 **FK:** codRampa->Rampa(codRampa)
🔑 **FK:** codHorarioDisp ->HorarioDisp(codHorarioDisp)

🔗 **Relaciones:**

- Rampa(N:1)
- HorarioDisp(N:1)

---

### **20) Rampa**

| Campo       | Tipo      |
| ----------- | --------- |
| codRampa    | char(8)   |
| descripcion | char(100) |
| capacidad   | int(8)    |

🔑 **PK:** codRampa
🔗 **Relaciones:**

- DispRampa(1:N)
- Ticket(N:1)
- AsignarHerramienta(1:N)

---

### **21) AsignarHerramienta**

| Campo                 | Tipo    |
| --------------------- | ------- |
| codAsignarHerramienta | char(8) |
| codHerramienta        | char(6) |
| codRampa              | char(8) |

🔑 **PK:** codAsignarHerramienta
🔑 **FK:** codHerramienta → Herramienta(codHerramienta)
🔑 **FK:** codRampa → Rampa(codRampa)

🔗 **Relaciones:**

- Rampa(N:1)
- Herramienta(N:1)

---

### **22) Herramienta**

| Campo          | Tipo     |
| -------------- | -------- |
| codHerramienta | char(6)  |
| nombre         | char(20) |
| marca          | char(20) |
| modelo         | char(20) |
| stock          | int (6)  |

🔑 **PK:** codHerramienta
🔗 **Relaciones:**

- AsignarHerramienta(1:N)

---
