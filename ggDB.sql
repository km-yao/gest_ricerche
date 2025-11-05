'''
    Creazione tabelle
'''

CREATE TABLE `concessionario`.`ricerche` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome_ricerca` VARCHAR(80) NOT NULL,
  `json_ricerca` TEXT NOT NULL,
  `tipo_ricerca` INT(11) UNSIGNED NOT NULL,
  `id_utente` INT(11) UNSIGNED NOT NULL,
  `id_documento` INT(11) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `concessionario`.`utenti` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(80) NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `concessionario`.`tipi_ricerche` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `descrizione` VARCHAR(80) NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `concessionario`.`documenti` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `timestamp` TIMESTAMP NULL,
  `tipo` VARCHAR(120) NULL,
  `dimensione` INT UNSIGNED NOT NULL,
  `dati_file` LONGBLOB NULL,
  PRIMARY KEY (`id`));


'''
    Inserimento dati
'''


INSERT INTO ricerche
    (nome_ricerca, json_ricerca, tipo_ricerca, id_utente)
VALUES
    ('nome_1', 'eyJub21lIjogIkF1dG9jZW50cmkgR2l1c3RvenppIiwgInNlZGUiOiAiUGVydWdpYSJ9', 2, 3),
    ('nome_2', 'eyJub21lIjogIk9mZmljaW5hIFJvc3NpIiwgInNlZGUiOiAiUm9tYSJ9', 1, 2),
    ('nome_3', 'eyJub21lIjogIkNhcnJvenplcmlhIEJpYW5jaGkiLCAic2VkZSI6ICJNaWxhbm8ifQ==', 3, 1),
    ('nome_4', 'eyJub21lIjogIk1vdG9TZXJ2aWNlIFZlcmRpIiwgInNlZGUiOiAiVG9yaW5vIn0=', 2, 1),
    ('nome_5', 'eyJub21lIjogIkVsZXR0cmF1dG8gTmVyaSIsICJzZWRlIjogIk5hcG9saSJ9', 1, 3),
    ('nome_6', 'eyJub21lIjogIlJpY2FtYmkgU3VkIiwgInNlZGUiOiAiQmFyaSJ9', 3, 2),
    ('nome_7', 'eyJub21lIjogIkF1dG9zYWxvbmUgQmx1IiwgInNlZGUiOiAiRmlyZW56ZSJ9', 2, 2),
    ('nome_8', 'eyJub21lIjogIkNlbnRybyBSZXZpc2lvbmkgQWxmYSIsICJzZWRlIjogIkdlbm92YSJ9', 1, 1),
    ('nome_9', 'eyJub21lIjogIkdvbW1lICYgQ28iLCAic2VkZSI6ICJQYWxlcm1vIn0=', 3, 3),
    ('nome_10', 'eyJub21lIjogIlNlcnZpY2UgUGnDuSIsICJzZWRlIjogIlBhZG92YSJ9', 2, 1),
    ('nome_11', 'eyJub21lIjogIkF1dG9mZmljaW5hIERlbHRhIiwgInNlZGUiOiAiUmVnZ2lvIEVtaWxpYSJ9', 1, 2),
    ('nome_12', 'eyJub21lIjogIkF1dG9ub2xlZ2dpbyBWZXJkZSIsICJzZWRlIjogIlBpc2EifQ==', 3, 1),
    ('nome_13', 'eyJub21lIjogIkNlbnRybyBBdXRvIEx1bmEiLCAic2VkZSI6ICJNb2RlbmEifQ==', 2, 3),
    ('nome_14', 'eyJub21lIjogIlJpcGFyYXppb25pIEV4cHJlc3MiLCAic2VkZSI6ICJBbmNvbmEifQ==', 1, 1),
    ('nome_15', 'eyJub21lIjogIk1lY2NhbmljYSBDZW50cmFsZSIsICJzZWRlIjogIlRyaWVzdGUifQ==', 3, 2),
    ('nome_16', 'eyJub21lIjogIkF1dG9mZmljaW5hIFJvbWEgRXN0IiwgInNlZGUiOiAiUm9tYSJ9', 2, 2),
    ('nome_17', 'eyJub21lIjogIkdhcmFnZSBTb2xhcmUiLCAic2VkZSI6ICJDYWdsaWFyaSJ9', 1, 3),
    ('nome_18', 'eyJub21lIjogIk9mZmljaW5hIDI0LzciLCAic2VkZSI6ICJCb2xvZ25hIn0=', 3, 1),
    ('nome_19', 'eyJub21lIjogIlNlcnZpY2UgTm9yZCIsICJzZWRlIjogIlZlcm9uYSJ9', 2, 3),
    ('nome_20', 'eyJub21lIjogIkF1dG9jZW50ZXIgSXRhbGlhIiwgInNlZGUiOiAiU2FsZXJubyJ9', 1, 2),
    ('nome_21', 'eyJub21lIjogIkNlbnRybyBSaXBhcmF6aW9uaSBNaWxhbm8iLCAic2VkZSI6ICJNaWxhbm8ifQ==',  3, 1);

INSERT INTO concessionario.tipi_ricerche
	(descrizione)
VALUES
	("per nome"),
    ("generica"),
    ("complessa");
    
INSERT INTO utenti
	(nome)
VALUES
	("Mario Rossi"),
    ("Luigi Verdi"),
    ("Gallo Viola");

    


















