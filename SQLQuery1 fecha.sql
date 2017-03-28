USE [BifrostSoftv]
GO
/****** Object:  StoredProcedure [dbo].[Softv_Reporte_PlantaGet]    Script Date: 17/03/2017 09:38:16 a.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[Softv_Reporte_PlantaGet]	
AS

 select t.san, 
 t.idSuscriptor, 
 'cliente' as Cliente,
 s.Nombre +' '+ s.Apellido as Suscriptor, 
 ser.Nombre as PlanDeServicio,
 'hub' as Hub,
 'beam' as Beam,
 'Pais' as Pais,  
  t.ESN, --no. de serie
  t.Estatus, -- est.comercial
  'estTec' as EstTecnico, --est. técnico
	t.Latitud,
	t.Longitud,
	convert(varchar(25), t.FechaAlta, 22) as FechaAlta,  --04/28/14  9:31:28 AM         22
	convert(varchar(25), m.Fecha, 22)  as FechaActivacion, --fecha activación
	convert(varchar(25),t.FechaSuspension, 22)  as FechaSuspension,
	'fecha cancelacion' as FechaCancelacion,
	'consumo a' as consumoAnytime,
	'consumo b' as consumoBonus,
	m.Detalle1 as TokenDisp
	from Terminal t
	inner join Suscriptor s on t.IdSuscriptor = s.IdSuscriptor
	inner join Servicio ser on ser.IdServicio = t.IdServicio
	inner join Movimiento m on m.SAN = t.SAN
	inner join Comando c on c.IdComando = m.IdComando
	--where c.Nombre like '%token%'

