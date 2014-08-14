var en_strings = {
	alert: 'ALERT!',
	warning: 'WARNING!',
	success: 'SUCCESS!',
	yes: 'Yes',
	//no: 'No, Cancel',
	no: 'No',
	ok: 'Ok',
	quit: 'Quit',
	close: 'Close',
	continue: 'Continue',
	confirmation: 'Confirmation',
	print: 'Print',
	sms: 'Text',
	email: 'Email',
	terminalId_warning: 'Changing the Terminal ID will overwrite all of the current application data.\n\nAre You sure You want to continue?',
	invalid_terminal: 'The Terminal ID you entered is not valid.\n\nPlease try again.',
	limitedFunctionality: 'Network not connected. Functionality is limited!',

	//index
	invalid_managerPin: 'The number you entered does not match any Manager PIN we have on record.',
	invalid_employeePin: 'The employee PIN could not be found.',
	enterDifferentPin: 'Please enter a different PIN\nand try again.',
	noNetwork: 'This device is currently not connected to a network. Please re-connect the device.',

	//pin pad
	enter_terminal: 'Enter Terminal ID',
	enter_pin: 'Enter PIN',

	//main menu items
	employee: 'Employee',
	manager: 'Manager',

	//clockInConfirmation
	review_Text: 'Review & Confirm Punch Details',
	master_photo: 'Master Photo',
	punch_photo: 'Punch Photo',
	in_punch_accept: 'Would you like to accept this IN punch?',
	out_punch_accept: 'Would you like to accept this OUT punch?',
	yes_accept: 'Yes & Exit',
	yes_view_hours: 'Yes & View Summary',
	no_exit: 'No & Start Over',
	date: 'Date: ',
	pin: 'PIN: ',
	clock_out_time: 'Clock Out Time: ',
	clock_in_time: 'Clock In Time: ',
	noNetworkForTimecard: 'This device is currently not connected to a network. Your punch was saved and will be processed once the network is available again.',

	//Clockin/out
	not_me: 'This is not me',
	clock_in: 'IN',
	clock_out: 'OUT',
	notAllowed: 'You are not allowed to clock back in yet.',
	notAllowed_2: 'You are not allowed to clock out yet.',
	alreadyClockedIn: 'You already CLOCKED IN\nat: ',
	alreadyClockedOut: 'You already CLOCKED OUT\nat: ',
	cantGoBackIn: 'Your punch is blocked.\nPlease wait ',

	// Soft Scheduling
	leavingForDay: 'Are you leaving for the day?',
	selectTimeIN: 'Touch the time you will START working: ',
	selectTimeOUT: 'Touch the time you will END working: ',
	selectShiftIN: 'Touch the shift you are clocking IN for: ',
	selectShiftOUT: 'Touch the shift you are clocking OUT for: ',
	earlyOrLate: 'Touch the reason for the ',
	earlyIn: 'Touch the reason for the EARLY IN: ',
	earlyOut: 'Touch the reason for the EARLY OUT: ',
	lateIn: 'Touch the reason for the LATE IN: ',
	lateOut: 'Touch the reason for the LATE OUT: ',
	veryEarlyIn: 'Touch the reason for the VERY EARLY IN: ',
	veryLateOut: 'Touch the reason for the VERY LATE OUT: ',
	earlyFromBreak: 'You are clocking in early from your meal period, do you want to continue?',
	savingPunch: 'Saving your punch, please wait...',
	immediatePunchFail: 'Your punch was saved and will be processed shortly.',
	immediatePunchSuccess: 'Your punch was processed successfully.',

	//departments
	dept_instructions: 'Please touch a department: ',
	deptUsed: 'You are already clocked into this department.',

	//new employee
	newEmp_instructions: 'Please enter your initials: ',
	newEmp_alert: 'Please enter your initials.',
	newEmp_invalidChars: 'This field only accepts letters. Please try again.',
	newEmp_tooManyChars: 'This field only allows for up to four characters.',
	newEmp_dialog: 'We could not match your PIN to any employees on this device. Are you a new employee?',

	//open departments
	openDept_sidebarHeader: 'Your departments',
	openDept_contentHeader: 'Search departments',
	openDept_instructions: 'Please touch a department in the sidebar or enter a department number.',
	openDept_textField: 'Enter department number',
	openDept_alert: 'The entered value is not a valid department number.',
	openDept_deptNotFound: 'Department not found.',

	//select employee
	not_listed: 'I\'m not listed',
	confirm_id: 'Please confirm your identity: ',
	contact_manager: 'Please contact your manager.',

	//timecard detail
	back_btn: 'Back',
	previous: 'Previous',
	next: 'Next',
	weekly_summ: 'Weekly Summary',
	daily_summ: 'Daily Summary',
	more_details: 'More Details',
	no_details: 'There is no more timesheet data available for your profile.',
	error_lbl: 'We apologize, there has been an error with establishing\na connection with the server. Please try again later.',
	error_lbl_2: 'Your timecard is currently inaccessible, but your punch was processed.\n\nPlease press the Done button in the top right-hand corner to complete your punch transaction.',
	error_lbl_3: 'This device is currently offline.\n\nPlease press the Done button in the top right corner.',
	timesheetReq_notRegisteredEmpl: 'There is no timesheet data available for this time period.',
	couldNotPrint: 'Cloud Clock was unable to print the timecard.\nPlease check your printer configuration.',

	//header
	done: 'Done',
	start_over: 'Start Over',
	help: 'Help',

	//employee options
	emplOpts_sidebarHeader: 'Options',
	timesheets: 'Timesheets',
	notifications: 'Notifications',
	genSettings: 'General Settings',
	personal_pref: 'Personal Preferences',
	sett_name_badge: 'Badge ID',
	sett_name_email: 'Email',
	sett_name_cell: 'Mobile Number',
	sett_name_carr: 'Mobile Carrier',
	mobileCarr: 'Please set up your mobile carrier.',
	lang_pref: 'Language Preference',
	english: 'English',
	espanol: 'Espanol',
	french: 'Francais',
	cell_phone: 'Mobile number: ',
	cell_carrName: 'Carrier name: ',
	email_txt_alert: 'The email address you entered is identical to the one we have on record.',
	enter_valid_email: 'Please enter a valid email.',
	enter_valid_cellNum: 'Please enter a valid mobile phone number.',
	select_carr_alert: 'Please select a mobile carrier.',
	cell_txt_alert: 'Please type in a mobile phone number.',
	noNetworkEmplOpts: 'These features are only available if the device is connected to a network.',

	//correct info
	correct_info: 'Is this information correct?',

	//end
	text_success_A: 'Your request was successful.\nPlease check your mobile phone for a text message.',
	text_success_B: 'You have successfully updated your mobile phone record!',
	email_success_A: 'Your request was successful. \nPlease check your e-mail.',
	email_success_B: 'You have successfully updated your e-mail record!',
	notifications_header: 'Notifications',
	delivery_prefs: 'Timesheet Delivery Preference',
	delivery_day: 'Timesheet Delivery Day',
	notif_text: 'Text',
	notif_both: 'Email and Text',
	sunday: 'Sunday',
	monday: 'Monday',
	tuesday: 'Tuesday',
	wednesday: 'Wednesday',
	thursday: 'Thursday',
	friday: 'Friday',
	saturday: 'Saturday',

	//set up cell and email
	instructions_cell: 'Set up your mobile number and provider.',
	instructions_email: 'Please Enter Your E-mail Address.',
	save: 'Save',
	cancel: 'Cancel',

	//hours verification
	hoursVerificationTitle: 'Hours verification',
	hoursVerificationLbl: 'Please select the hours that are incorrect.',
	submitDispute: 'Submit',

	//footer
	more_options: 'More Options',

	//Page timeout
	session_timeout: 'Your session is about to timeout.',

	//camera view
	center_face: 'Please make sure your face is showing in the area below.',
	take_photo: 'Take Photo',
	locating_face: 'Please wait, detecting facial features...',
	
	//manager options
	notEnoughDigits: 'Terminal ID MUST have 10 digits, please alter your entry accordingly.',
	noNetworkToSendLogs: 'This device is currently not connected to a network. Please re-connect the device and try again.'
};

var es_strings = {
	alert: '¡ALERTA!',
	warning: '¡ADVERTENCIA!',
	success: '¡EXITO!',
	yes: 'Sí',
	// no: 'No, Cancelar',
	no: 'No',
	ok: 'Aceptar',
	quit: 'Salir',
	close: 'Cerrar',
	continue: 'Continuar',
	confirmation: 'Confirmación',
	print: 'Imprimir',
	sms: 'Texto',
	email: 'Correo',
	terminalId_warning: 'Cambiar el Número de terminal borrará toda información en esta aplicación.\n\n¿Está seguro que desea continuar?',
	invalid_terminal: 'El número de terminal que ingreso no es válido.\n\nFavor de intentar nuevamente.',
	limitedFunctionality: 'ES ~ Network not connected, Cloud Clock\'s functionality is limited!',
	
	//index
	invalid_managerPin: 'El número que ingreso no coincide con ninguno de los PINs para administradores que tenemos archivados.',
	invalid_employeePin: 'El PIN de empleado no puede encontrarse.',
	enterDifferentPin: 'Por favor, ingrese un PIN distinto\ny pruebe de nuevo.',
	noNetwork: 'Este dispositivo no está conectado actualmente a la red, por favor vuelva a conectar el dispositivo.',
	
	//pin pad
	enter_terminal: 'Ingrese Numero de Terminal',
	enter_pin: 'Ingrese PIN',
	
	//main menu items
	employee: 'Empleado',
	manager: 'Supervisor',
	
	//clockInConfirmation
	review_Text: 'Revisar y Confirmar detalles de marcado',
	master_photo: 'Foto Master',
	punch_photo: 'Foto de Marcado',
	in_punch_accept: '¿Le gustaría aceptar esta hora de Entrada?',
	out_punch_accept: '¿Le gustaría aceptar esta hora de Salida?',
	yes_accept: 'Si & Salir',
	yes_view_hours: 'Si & Ver Resumen',
	no_exit: 'No & Comenzar de Nuevo',
	date: 'Fecha: ',
	pin: 'PIN: ',
	clock_out_time: 'Hora de Salida: ',
	clock_in_time: 'Hora de Entrada: ',
	noNetworkForTimecard: 'Este dispositivo no está conectado actualmente a la red. Su marcado fue guardado y será procesado una vez que la red esté disponible de nuevo.',

	//Clockin/out
	not_me: 'Nos soy esta persona',
	clock_in: 'Entrada',
	clock_out: 'Salida',
	notAllowed: 'No tiene permitido volver a marcar entrada todavía.',
	notAllowed_2: 'No tiene permitido marcar salida todavía.',
	alreadyClockedIn: 'Ya ha MARCADO ENTRADA\nen: ',
	alreadyClockedOut: 'Ya ha MARCADO SALIDA\nen: ',
	cantGoBackIn: 'Su marcado está bloqueado.\nPor favor, espere.',

	// Soft Scheduling
	leavingForDay: '¿Está dejando por hoy?',
	selectTimeIN: 'Toque la hora en que COMENZARÁ a trabajar: ',
	selectTimeOUT: 'Toque la hora en que FINALIZARÁ de trabajar: ',
	selectShiftIN: 'Toque el turno en que marcará ENTRADA: ',
	selectShiftOUT: 'Toque el turno para el cual está SALIDA: ',
	earlyOrLate: 'Toque la razón para ',
	earlyIn: 'Toque la razón para ENTRADA TEMPRANO: ',
	earlyOut: 'Toque la razón para SALIDA TEMPRANO: ',
	lateIn: 'Toque la razón para ENTRADA TARDE: ',
	lateOut: 'Toque la razón para SALIDA TARDE: ',
	veryEarlyIn: 'Toque la razón para ENTRADA MUY TEMPRANO: ',
	veryLateOut: 'Toque la razón para SALIDA MUY TARDE: ',
	earlyFromBreak: 'Está marcando entrada temprano en su período de comida, ¿Desea continuar?',
	savingPunch: 'Guardando su marcado, por favor espere...',
	immediatePunchFail: 'Su marcado fue guardado y será procesado prontamente.',
	immediatePunchSuccess: 'Su marcado fue procesado satisfactoriamente.',
	
	//departments
	dept_instructions: 'Por favor toque departamento: ',
	deptUsed: 'Ya ha marcado en este departamento.',
	
	//new employee
	newEmp_instructions: 'Por favor ingrese sus iniciales: ',
	newEmp_alert: 'Por favor ingrese sus iniciales.',
	newEmp_invalidChars: 'Esta área solo acepta letras. Favor de intentar nuevamente.',
	newEmp_tooManyChars: 'Esta área solo acepta hasta 4 caracteres.',
	newEmp_dialog: 'No podemos coincidir su PIN con ningún empleado en este dispositivo. ¿Es usted un empleado nuevo?',
	
	//open departments
	openDept_sidebarHeader: 'Su departamentos',
	openDept_contentHeader: 'Busca departamentos',
	openDept_instructions: 'Por favor toque departamento en la barra lateral o ingrese número de departamento.',
	openDept_textField: 'Ingrese número de departamento',
	openDept_alert: 'Por favor Ingrese Número de  Departamento.',
	openDept_deptNotFound: 'Departamento no encontrado.',
	
	//select employee
	not_listed: 'Yo No estoy en la lista',
	confirm_id: 'Por favor confirme su identidad: ',
	contact_manager: 'Por favor contacte a su supervisor.',
	
	//timecard detail
	back_btn: 'Regresar',
	previous: 'Anterior',
	next: 'Siguiente',
	weekly_summ: 'Resumen Semanal',
	daily_summ: 'Resumen Diario',
	more_details: 'Mas Detalles',
	no_details: 'No hay más información disponible concerniente a sus hojas de tiempo en su perfil de usuario.',
	error_lbl: 'Disculpe la molestia. Ha ocurrido un error al tratar de estableser\na conneccion con el servidor. Favor de intentar más tarde.',
	error_lbl_2: 'Su tarjeta de registro de tiempo está actualmente inaccesible, pero su marcado fue procesado.\n\nPor favor, presione el botón Terminar en la esquina superior derecha para completar su transacción de marcado.',
	error_lbl_3: 'Este dispositivo está actualmente fuera de línea.\n\nPor favor, presione el botón Terminar en la esquina superior derecha.',
	timesheetReq_notRegisteredEmpl: 'No hay datos de hoja de tiempo disponible para este período de tiempo.',
	couldNotPrint: 'No se puede imprimir la tarjeta de registro de tiempo.\nPor favor, verifique la configuración de su impresora.',

	//header
	done: 'Terminar',
	start_over: 'Comenzar de Nuevo',
	help: 'Ayuda',

	//employee options
	emplOpts_sidebarHeader: 'Opciones',
	timesheets: 'Hojas de tiempo',
	notifications: 'Notificaciones',
	genSettings: 'Configuración General',
	personal_pref: 'Preferencias Personales',
	sett_name_badge: 'Número de  credencial',
	sett_name_email: 'Correo Electrónico',
	sett_name_cell: 'Número de Celular',
	sett_name_carr: 'Operador de telefonia móvil',
	mobileCarr: 'Por favor, configure su\nempresa de comunicaciones móviles.',
	lang_pref: 'Preferencia de Idioma',
	english: 'Ingles',
	espanol: 'Español ',
	french: 'Frances',
	cell_phone: 'Número de Celular: ',
	cell_carrName: 'Compañía de Servicio: ',
	email_txt_alert: 'El correo electrónico que ingreso es idéntico al que tenemos en nuestros archivos.',
	enter_valid_email: 'Por favor ingrese un correo electrónico valido.',
	enter_valid_cellNum: 'Por favor ingrese un número de celular valido.',
	select_carr_alert: 'Por favor seleccione compañía de servicio celular.',
	cell_txt_alert: 'Por favor ingrese número de teléfono celular.',
	noNetworkEmplOpts: 'Estas funciones solo están disponibles si el dispositivo está conectado a una red.',
	
	//correct info
	correct_info: '¿Es correcta esta información?',
	//end
	
	text_success_A: 'Su petición fue exitosa.\nPor favor verifique mensaje de texto en su telefono celular.',
	text_success_B: 'Usted ha actualizado exitosamente el registro de telefono celular!',
	email_success_A: 'Su petición fue exitosa. \nPor favor verifique su correo electrónico.',
	email_success_B: 'Usted ha actualizado exitosamente su correo electrónico.',
	notifications_header: 'Notificaciones',
	delivery_prefs: 'Preferencias de Envío para Hoja de Tiempo',
	delivery_day: 'Día de envío de Hoja de Tiempo',
	notif_text: 'Texto',
	notif_both: 'Correo Electrónico & Texto',
	sunday: 'Domingo',
	monday: 'Lunes',
	tuesday: 'Martes',
	wednesday: 'Miercoles',
	thursday: 'Jueves',
	friday: 'Viernes',
	saturday: 'Sabado',

	//set up cell and email
	instructions_cell: 'Ingrese su número de celular y la\ncompañía proveedora del servicio.',
	instructions_email: 'Por favor, ingrese su dirección de correo electrónico.',
	save: 'Guardar',
	cancel: 'Cancelar',

	//hours verification
	hoursVerificationTitle: 'Verificación de horas',
	hoursVerificationLbl: 'Por favor, seleccione las horas que están incorrectas',
	submitDispute: 'Enviar',

	//footer
	more_options: 'Mas Opciones',

	//Page timeout
	session_timeout: 'Su sesión está a punto de terminar.',

	//camera view
	center_face: 'Por favor asegúrese que su cara aparezca en el área en la parte inferior.',
	take_photo: 'Tomar Foto',
	locating_face: 'Por favor espere, detectando funciones faciales...',

	//manager options
	notEnoughDigits: 'El ID de terminal DEBE tener 10 dígitos, por favor altere su ingreso consecuentemente.',
	noNetworkToSendLogs: 'Este dispositivo actualmente no está conectado a la red, por favor re-conecte el dispositivo y pruebe nuevamente.'
};

var fr_strings = {
	alert: 'ALERTE!',
	warning: 'AVERTISSEMENT!',
	success: 'SUCCES!',
	yes: 'Oui',
	// no: 'Non, Annuler',
	no: 'Non',
	ok: 'Ok',
	quit: 'Quitter',
	close: 'Fermer',
	continue: 'Continuer',
	confirmation: 'Confirmation',
	print: 'Imprimer',
	sms: 'Texte',
	email: 'Courriel',
	terminalId_warning: 'Changer l’identifiant du terminal remplacera toutes les données actuelles de l’application.\nÊtes-vous sûr de vouloir continuer?',
	invalid_terminal: 'L’identifiant de terminal que vous avez saisi n’est pas valide.\n\nVeuillez réessayer.',
	limitedFunctionality: 'FR ~ Network not connected, Cloud Clock\'s functionality is limited!',

	//index
	invalid_managerPin: 'Le numéro que vous avez saisi ne correspond à aucun des NIP de gestionnaire\nque nous avons dans nos dossiers..',
	invalid_employeePin: 'Le NIP d’employé est introuvable.',
	enterDifferentPin: 'Veuillez saisir un différent NIP\net réessayer.',
	noNetwork: 'Cet appareil n’est actuellement connecté à aucun réseau, veuillez reconnecter l’appareil.',

	//pin pad
	enter_terminal: 'Saisir l’identifiant du termina',
	enter_pin: 'Saisir le NIP',

	//main menu items
	employee: 'Employé',
	manager: 'Gestionnaire',

	//clockInConfirmation
	review_Text: 'Revoir et confirmer les détails de pointage',
	master_photo: 'Photo maître',
	punch_photo: 'Photo du pointage',
	in_punch_accept: 'Souhaitez-vous accepter ce pointage à l’entrée?',
	out_punch_accept: 'Souhaitez-vous accepter ce pointage à la sortie?',
	yes_accept: 'Oui et Quitter',
	yes_view_hours: 'Oui et Afficher le résumé',
	no_exit: 'Non et Recommencer',
	date: 'Date: ',
	pin: 'NIP: ',
	clock_out_time: 'Le temps de sortie: ',
	clock_in_time: 'Le temps de l’entrée: ',
	noNetworkForTimecard: 'Cet appareil n’est actuellement connecté à aucun réseau. Votre pointage a été enregistré et sera traité une fois que le réseau sera à nouveau disponible.',

	//Clockin/out
	not_me: 'Ce n’est pas moi',
	clock_in: 'Entrée',
	clock_out: 'Sortie',
	notAllowed: 'Vous n’êtes pas encore autorisé à pointer à l’entrée à nouveau.',
	notAllowed_2: 'Vous n’êtes pas encore autorisé à pointer à la sortie.',
	alreadyClockedIn: 'Vous avez déjà POINTÉ À L’ENTRÉE\nà: ',
	alreadyClockedOut: 'Vous avez déjà POINTÉ À LA SORTIE\nà: ',
	cantGoBackIn: 'Votre pointage est bloqué.\nVeuillez patienter ',

	// Soft Scheduling
	leavingForDay: 'Quittez-vous pour la journée?',
	selectTimeIN: 'Appuyez sur l’heure à laquelle vous COMMENCEREZ à travailler: ',
	selectTimeOUT: 'Appuyez sur l’heure à laquelle vous FINIREZ de travailler: ',
	selectShiftIN: 'Appuyez sur le quart de travail pour lequel vous pointez à l’ENTRÉE: ',
	selectShiftOUT: 'Appuyez sur le quart de travail pour lequel vous pointez à la SORTIE: ',
	earlyOrLate: 'Appuyez sur la raison du ',
	earlyIn: 'Appuyez sur la raison du POINTAGE À L’ENTRÉE EN AVANCE: ',
	earlyOut: 'Appuyez sur la raison du POINTAGE À LA SORTIE EN AVANCE: ',
	lateIn: 'Appuyez sur la raison du POINTAGE À L’ENTRÉE EN RETARD: ',
	lateOut: 'Appuyez sur la raison du POINTAGE À LA SORTIE EN RETARD: ',
	veryEarlyIn: 'Appuyez sur la raison du POINTAGE À L’ENTRÉE TRÈS EN AVANCE: ',
	veryLateOut: 'Appuyez sur la raison du POINTAGE À LA SORTIE TRÈS EN RETARD: ',
	earlyFromBreak: 'Vous pointez à l’entrée pour le retour de votre période de repas, souhaitez-vous continuer?',
	savingPunch: 'Enregistrement de votre pointage...',
	immediatePunchFail: 'Votre pointage a été enregistré et sera traité sous peu.',
	immediatePunchSuccess: 'Votre pointage a été traité avec succès.',

	//departments
	dept_instructions: 'Veuillez appuyez sur un département: ',
	deptUsed: 'Vous avez déjà pointé pour ce département.',

	//new employee
	newEmp_instructions: 'Veuillez saisir vos initiales: ',
	newEmp_alert: 'Veuillez saisir vos initiales..',
	newEmp_invalidChars: 'Ce champ n’accepte que des lettres. Veuillez réessayer.',
	newEmp_tooManyChars: 'Ce champ permet de saisir jusqu’à quatre caractères.',
	newEmp_dialog: 'Votre NIP ne correspond à aucun employé dans nos dossiers.  Êtes-vous un nouvel employé?',

	//open departments
	openDept_sidebarHeader: 'Vos départements',
	openDept_contentHeader: 'Rechercher des départements',
	openDept_instructions: 'Veuillez appuyez sur un département dans la barre latérale ou saisir un numéro de département.',
	openDept_textField: 'Saisir un numéro de département',
	openDept_alert: 'La valeur saisie n’est pas un numéro de département valide.',
	openDept_deptNotFound: 'Département introuvable.',

	//select employee
	not_listed: 'Je ne suis pas répertorié.',
	confirm_id: 'Veuillez confirmer votre identité: ',
	contact_manager: 'Veuillez contacter votre gérant.',

	//timecard detail
	back_btn: 'Reculer',
	previous: 'Précédent',
	next: 'Suivant',
	weekly_summ: 'Résumé hebdomadaire',
	daily_summ: 'Résumé quotidien',
	more_details: 'Plus de détails',
	no_details: 'Il n’y a plus de données de feuille de temps disponible pour votre profil.',
	error_lbl: 'Veuillez nous excuser, il y a eu une erreur lors de l’établissement de la connexion avec le serveur. Veuillez réessayer plus tard.',
	error_lbl_2: 'Votre carte de pointage est actuellement inaccessible, mais votre pointage a été traité.\n\nVeuillez appuyer sur le bouton Terminé au coin supérieur droit pour conclure votre transaction de pointage.',
	error_lbl_3: 'Cet appareil est actuellement hors-ligne.\n\nVeuillez appuyer sur le bouton Terminé au coin supérieur droit.',
	timesheetReq_notRegisteredEmpl: 'Il n’y a aucune donnée de feuille de temps disponible pour cette période.',
	couldNotPrint: 'Impossible d’imprimer la carte de pointage. Veuillez vérifier la configuration de votre imprimante.',

	//header
	done: 'Terminé',
	start_over: 'Recommencer',
	help: 'Aide',

	//employee options
	emplOpts_sidebarHeader: 'Options',
	timesheets: 'Feuilles de temps',
	notifications: 'Notifications',
	genSettings: 'Paramètres généraux',
	personal_pref: 'Préférences personnelles',
	sett_name_badge: 'Identifiant du badge',
	sett_name_email: 'Courriel',
	sett_name_cell: 'Numéro de téléphone cellulaire',
	sett_name_carr: 'Opérateur de téléphonie mobile',
	mobileCarr: 'Veuillez configurer votre opérateur\nde téléphonie mobile.',
	lang_pref: 'Préférence de langue',
	english: 'English',
	espanol: 'Espanol',
	french: 'Français',
	cell_phone: 'Numéro de téléphone cellulaire: ',
	cell_carrName: 'Nom de l’opérateur de téléphonie mobile: ',
	email_txt_alert: 'L’adresse courriel que vous avez saisie est identique à celle que nous avons dans nos dossiers.',
	enter_valid_email: 'Veuillez saisir une adresse courriel valide.',
	enter_valid_cellNum: 'Veuillez saisir un numéro de téléphone cellulaire valide.',
	select_carr_alert: 'Veuillez sélectionner un opérateur de téléphonie mobile.',
	cell_txt_alert: 'Veuillez taper un numéro de téléphone cellulaire.',
	noNetworkEmplOpts: 'Ces fonctions ne sont disponibles que si l’appareil est connecté à un réseau.',

	//correct info
	correct_info: 'Cette information est-elle correcte?',

	//end
	text_success_A: 'Votre demande a été traitée avec succès.\nVeuillez vérifier la réception d’un message texte sur votre téléphone cellulaire.',
	text_success_B: 'Vous avez mis à jour votre entrée de téléphone cellulaire avec succès!',
	email_success_A: 'Votre demande a été traitée avec succès.\nVeuillez vérifier vos courriels.',
	email_success_B: 'Vous avez mis à jour votre entrée de courriel avec succès!',
	notifications_header: 'Notifications',
	delivery_prefs: 'Préférence de distribution de la feuille de temps',
	delivery_day: 'Jour de distribution de la feuille de temps',
	notif_text: 'Texte',
	notif_both: 'Courriel et texte',
	sunday: 'Dimanche',
	monday: 'Lundi',
	tuesday: 'Mardi',
	wednesday: 'Mercredi',
	thursday: 'Jeudi',
	friday: 'Vendredi',
	saturday: 'Samedi',

	//set up cell and email
	instructions_cell: 'Configurez votre numéro de téléphone cellulaire\net votre fournisseur de téléphonie mobile.',
	instructions_email: 'Veuillez saisir votre adresse courriel.',
	save: 'Enregistrer',
	cancel: 'Annuler',

	//hours verification
	hoursVerificationTitle: 'Vérification des heures',
	hoursVerificationLbl: 'Veuillez sélectionner les heures qui sont erronées.',
	submitDispute: 'Soumettre',

	//footer
	more_options: 'Plus d’options',

	//Page timeout
	session_timeout: 'Votre session va bientôt expirer.',

	//camera view
	center_face: 'Veuillez vous assurer que votre visage apparaît dans la région ci-dessous.',
	take_photo: 'Prendre une photo',
	locating_face: 'Veuillez patienter, détection des traits du visage...',

	// manager options
	notEnoughDigits: 'L’identifiant du terminal DOIT contenir 10 caractères, veuillez modifier votre saisie en conséquence.',
	noNetworkToSendLogs: 'Cet appareil n’est actuellement connecté à aucun réseau, veuillez reconnecter l’appareil et réessayer.'
};


exports.strings = function(text){
	try{
		// console.log('\n\n\nCloud clock language parameter set to: ' + Ti.App.Properties.getString('LANGUAGETYPE'));
		// console.log('\n\n\nCloud clock CURRENT LANGUAGE set to: ' + Ti.App.Properties.getString('CURRLANGUAGETYPE'));
		var language = Ti.App.Properties.getString('CURRLANGUAGETYPE');
		// console.log('Current language type: ' + language);
		if(language === 'en-us' || language === 'en_us' || language === 'en-US' || !language || language === 'undefined') return en_strings[text];
		if(language === 'es') return es_strings[text];
		if(language === 'fr') return fr_strings[text];
	}catch(error){
		CloudClock.error(error);
	}
};


