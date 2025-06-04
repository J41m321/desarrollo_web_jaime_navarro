CREATE TABLE IF NOT EXISTS `tarea2`.`comentario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(80) NOT NULL,
  `texto` VARCHAR(300) NOT NULL,
  `fecha` TIMESTAMP NOT NULL,
  `servicio_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_comentario_servicio1_idx` (`servicio_id` ASC),
  CONSTRAINT `fk_comentario_servicio1`
    FOREIGN KEY (`servicio_id`)
    REFERENCES `tarea2`.`servicio` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;