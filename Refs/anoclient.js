/* jQuery ColorPicker -*-c-*-
   Written by Virgil Reboton(vreboton@gmail.com)

   ColorPicker function structures and attahcment is base on
   jQuery UI Date Picker v3.3beta
   by Marc Grabanski (m@marcgrabanski.com) and Keith Wood (kbwood@virginbroadband.com.au).

   ColorPicker render data is base on
   http://www.mattkruse.com/javascript/colorpicker/
   by Matt Kruse

*/

(function($) { // hide the namespace

function colorPicker()
{
        this._nextId = 0; // Next ID for a time picker instance
        this._inst = []; // List of instances indexed by ID
        this._curInst = null; // The current instance in use
        this._colorpickerShowing = false;
        this._colorPickerDiv = $('<div id="colorPickerDiv"></div>');
}
$.extend(colorPicker.prototype, {
        /* Class name added to elements to indicate already configured with a time picker. */
        markerClassName: 'hasColorPicker',

        /* Register a new time picker instance - with custom settings. */
        _register: function(inst) {
                var id = this._nextId++;
                this._inst[id] = inst;
                return id;
        },

        /* Retrieve a particular time picker instance based on its ID. */
        _getInst: function(id) {
                return this._inst[id] || id;
        },

        /* Handle keystrokes. */
        _doKeyDown: function(e) {
        var inst = $.colorPicker._getInst(this._colId);
                if ($.colorPicker._colorpickerShowing) {
                        switch (e.keyCode) {
                                case 9:
                                    // hide on tab out
                                    $.colorPicker.hideColorPicker();
                    break;

                                case 27:
                                    // hide on escape
                                    $.colorPicker.hideColorPicker();
                                        break;
            }
                }
                else if (e.keyCode == 40) { // display the time picker on down arrow key
                        $.colorPicker.showFor(this);
                }
        },

/* Handle keystrokes. */
        _resetSample: function(e) {
        var inst = $.colorPicker._getInst(this._colId);
                inst._sampleSpan.css('background-color', inst._input.value);
                alert(inst._input.value);
        },

    /* Does this element have a particular class? */
        _hasClass: function(element, className) {
                var classes = element.attr('class');
                return (classes && classes.indexOf(className) > -1);
        },

    /* Pop-up the time picker for a given input field.
           @param  control  element - the input field attached to the time picker or
                            string - the ID or other jQuery selector of the input field or
                            object - jQuery object for input field
           @return the manager object */
        showFor: function(control) {
                control = (control.jquery ? control[0] :
                        (typeof control == 'string' ? $(control)[0] : control));
                var input = (control.nodeName && control.nodeName.toLowerCase() == 'input' ? control : this);

                if ($.colorPicker._lastInput == input) { return; }
                if ($.colorPicker._colorpickerShowing) { return; }

                var inst = $.colorPicker._getInst(input._colId);

                $.colorPicker.hideColorPicker();
                $.colorPicker._lastInput = input;

                if (!$.colorPicker._pos) { // position below input
                        $.colorPicker._pos = $.colorPicker._findPos(input);
                        $.colorPicker._pos[1] += input.offsetHeight; // add the height
                }

                var isFixed = false;
                $(input).parents().each(function() {
                        isFixed |= $(this).css('position') == 'fixed';
                });

                if (isFixed && $.browser.opera) { // correction for Opera when fixed and scrolled
                        $.colorPicker._pos[0] -= document.documentElement.scrollLeft;
                        $.colorPicker._pos[1] -= document.documentElement.scrollTop;
                }

            inst._colorPickerDiv.css('position', ($.blockUI ? 'static' : (isFixed ? 'fixed' : 'absolute'))).css('left', $.colorPicker._pos[0] + 'px').css('top', $.colorPicker._pos[1]+1 + 'px');

                $.colorPicker._pos = null;
                $.colorPicker._showColorPicker(inst);

                return this;
        },

    /* Find an object's position on the screen. */
        _findPos: function(obj) {
                while (obj && (obj.type == 'hidden' || obj.nodeType != 1)) {
                        obj = obj.nextSibling;
                }
                var curleft = curtop = 0;
                if (obj && obj.offsetParent) {
                        curleft = obj.offsetLeft;
                        curtop = obj.offsetTop;
                        while (obj = obj.offsetParent) {
                                var origcurleft = curleft;
                                curleft += obj.offsetLeft;
                                if (curleft < 0) {
                                        curleft = origcurleft;
                                }
                                curtop += obj.offsetTop;
                        }
                }
                return [curleft,curtop];
        },

        /* Close time picker if clicked elsewhere. */
        _checkExternalClick: function(event) {
                if (!$.colorPicker._curInst)
                {
                        return;
                }
                var target = $(event.target);

                if ((target.parents("#colorPickerDiv").length == 0) && $.colorPicker._colorpickerShowing && !($.blockUI))
                {
                    if (target.text() != $.colorPicker._curInst._colorPickerDiv.text())
                        $.colorPicker.hideColorPicker();
                }
        },

    /* Hide the time picker from view.
           @param  speed  string - the speed at which to close the time picker
           @return void */
        hideColorPicker: function(s) {
                var inst = this._curInst;
                if (!inst) {
                        return;
                }

                if (this._colorpickerShowing)
                {
                        this._colorpickerShowing = false;
                        this._lastInput = null;

                        this._colorPickerDiv.css('position', 'absolute').css('left', '0px').css('top', '-1000px');

                        if ($.blockUI)
                        {
                                $.unblockUI();
                                $('body').append(this._colorPickerDiv);
                        }

            this._curInst = null;
                }

                if (inst._input[0].value != $.css(inst._sampleSpan,'background-color'))
                {
                    inst._sampleSpan.css('background-color',inst._input[0].value);
                }
        },

        /* Attach the time picker to an input field. */
        _connectColorPicker: function(target, inst) {
                var input = $(target);
                if (this._hasClass(input, this.markerClassName)) { return; }

                $(input).attr('autocomplete', 'OFF'); // Disable browser autocomplete
                inst._input = $(input);

                // Create sample span
                inst._sampleSpan = $('<span class="ColorPickerDivSample" style="background-color:' + inst._input[0].value + ';height:' + inst._input[0].offsetHeight + ';">&nbsp;</span>');
                input.after(inst._sampleSpan);

                inst._sampleSpan.click(function() {
                    input.focus();
                });

                input.focus(this.showFor);

                input.addClass(this.markerClassName).keydown(this._doKeyDown);
                input[0]._colId = inst._id;
        },


        /* Construct and display the time picker. */
        _showColorPicker: function(id) {
                var inst = this._getInst(id);
                this._updateColorPicker(inst);

        inst._colorPickerDiv.css('width', inst._startTime != null ? '10em' : '6em');

                inst._colorPickerDiv.show('fast');
                if (inst._input[0].type != 'hidden')
        {
                    inst._input[0].focus();
        }

                this._curInst = inst;
                this._colorpickerShowing = true;
        },

        /* Generate the time picker content. */
        _updateColorPicker: function(inst) {
                inst._colorPickerDiv.empty().append(inst._generateColorPicker());
                if (inst._input && inst._input[0].type != 'hidden')
                {
                        inst._input[0].focus();

            $("td.color", inst._timePickerDiv).unbind().mouseover(function() {
                inst._sampleSpan.css('background-color', $.css(this,'background-color'));
            }).click(function() {
                inst._setValue(this);
            }).mouseout(function() {
                inst._sampleSpan.css('background-color', couleurInitiale);
            });
        }
    }

});

/* Individualised settings for time picker functionality applied to one or more related inputs.
   Instances are managed and manipulated through the TimePicker manager. */
function ColorPickerInstance()
{
        this._id = $.colorPicker._register(this);
        this._input = null;
        this._colorPickerDiv = $.colorPicker._colorPickerDiv;
        this._sampleSpan = null;
}

$.extend(ColorPickerInstance.prototype, {
        /* Get a setting value, defaulting if necessary. */
        _get: function(name) {
                return (this._settings[name] != null ? this._settings[name] : $.colorPicker._defaults[name]);
        },

    _getValue: function () {
        if (this._input && this._input[0].type != 'hidden' && this._input[0].value != "")
                {
                        return this._input[0].value;
        }
        return null;
    },

        _setValue: function (sel) {
        // Update input field
        if (this._input && this._input[0].type != 'hidden')
                {
                    this._input[0].value = $.attr(sel,'title');
                        $(this._input[0]).change();
        }

        // Hide picker
        $.colorPicker.hideColorPicker();
    },

        /* Generate the HTML for the current state of the time picker. */
        _generateColorPicker: function() {
        // Code to populate color picker window
        var colors  = new Array("#000000","#111111","#222222","#333333","#444444","#555555","#666666","#777777","#888888","#999999","#aaaaaa",  // noir/gris
                                "#000044","#000066","#000088","#0000aa","#0000cc","#0000ff",                                                    // bleu
                                "#002244","#004466","#004488","#0044aa","#0044cc","#0044ff",                                                    // cyan
                                "#220044","#440066","#440088","#4400aa","#4400cc","#4400ff",                                                    // violet foncé
                                "#550044","#880066","#880088","#8800aa","#8800cc","#8800ff",                                                    // violet
                                "#222244","#444466","#444488","#4444aa","#4444cc","#4444ff",                                                    // bleu ciel
                                "#004400","#006600","#008800","#00aa00","#00cc00",                                                              // vert
                                "#004444","#006644","#008844","#00aa44","#00cc44",                                                              // vert émeraude
                                "#224400","#446600","#448800","#44aa00","#44cc00",                                                              // vert pomme
                                "#224422","#446644","#448844","#44aa44","#44cc44",                                                              // vert jade
                                "#440000","#660000","#880000","#aa0000","#cc0000","#ff0000",                                                    // rouge
                                "#440022","#660044","#880044","#aa0066","#cc0066","#ff0066",                                                    // rose foncé
                                "#442222","#664444","#884444","#aa4444","#cc4444","#ff4444",                                                    // rose clair
                                "#442200","#664400","#884400","#aa4400","#cc6600","#ff6600",                                                    // marron/orange
                                "#444400","#666600","#888800","#aaaa00","#cccc00"                                                               // jaune
                                );

        var total = colors.length;
        var width = 45;
            var html = "<table border='1px' cellspacing='0' cellpadding='0'>";

            for (var i=0; i<total; i++)
            {
                    if ((i % width) == 0) { html += "<tr>"; }

                    html += '<td class="color" title="' + colors[i] + '" style="background-color:' + colors[i] + '"><label>&nbsp;&nbsp;&nbsp;</label></td>';

                    if ( ((i+1)>=total) || (((i+1) % width) == 0))
                    {
                        html += "</tr>";
            }
                }

                html += "</table>";

        return html
        }

});


/* Attach the time picker to a jQuery selection.
   @param  settings  object - the new settings to use for this time picker instance (anonymous)
   @return jQuery object - for chaining further calls */
$.fn.attachColorPicker = function() {
        return this.each(function() {
                        var inst = new ColorPickerInstance();
                        $.colorPicker._connectColorPicker(this, inst);
        });
};

$.fn.getValue = function() {
        var inst = (this.length > 0 ? $.colorPicker._getInst(this[0]._colId) : null);
        return (inst ? inst._getValue() : null);
};

$.fn.setValue = function(value) {
        var inst = (this.length > 0 ? $.colorPicker._getInst(this[0]._colId) : null);
        if (inst) inst._setValue(value);
};

/* Initialise the time picker. */
$(document).ready(function() {
        $.colorPicker = new colorPicker(); // singleton instance
        $(document.body).append($.colorPicker._colorPickerDiv).mousedown($.colorPicker._checkExternalClick);
});

})(jQuery);
/* Variables globales de l'application */

var session, dernieresDonnees, titreInitial, couleurInitiale, timer, sourisX, sourisY, listeOnglets, messageCompletionTimer;
var version = "2.1.0";
var nbMessagesEnTout = 0;
var nbMessagesEnCours = 0;
var nbErreursEnvoi = 0;
var ecranActuel = 0;
var modeForcerRegles = false;
var pseudo = "";
var motDePasseChiffre = "";
var optionsChat = "";
var salonConnexion = 0;
var salonForce = 0;
var ancienSalon = "";
var listeCompletion = new Array();
var indicateurNouveauMessage = 0;
var compteurAccepterRegles = 0;
var alternateur = 0;
var suiteTouchesTab = 0;

/* Fonctions AJAX */

function timerPrincipal() {
    alternerIndicateurNouveauMessage();
    majCompteurAccepterRegles();

    alternateur = (alternateur + 1) % 3;

    if (alternateur != 0)
        return;

    if (nbMessagesEnCours > 0)
        return;

    if (nbErreursEnvoi > 0)
        envoyerMessage(dernieresDonnees);
    else if (ecranActuel > 0)
        envoyerMessage({ q: "act", v: version, s: session, a: nbMessagesEnTout });
}

function envoyerConnexion(identifiant, motdepasse, mode, salon) {
    envoyerMessage({ q: "conn", v: version, identifiant: identifiant, motdepasse: motdepasse, mode: mode,
        decalageHoraire: new Date().getTimezoneOffset(), options: optionsChat, salon: salon });
}

function envoyerReconnexionAutomatique() {
    nbMessagesEnCours = 0;
    envoyerConnexion(pseudo, motDePasseChiffre, 2, 1);
}

function peutEnvoyerCommande() {
    if (nbErreursEnvoi > 0 && dernieresDonnees.q != "act") {
        alert("Vous semblez actuellement avoir un souci de connexion. Patientez un peu, cela va peut-être se rétablir.");
        return false;
    } else
        return true;
}

function envoyerCommande(commande) {
    if (peutEnvoyerCommande())
        envoyerMessage({ q: "cmd", v: version, s: session, c: commande, a: nbMessagesEnTout });
}

function envoyerMessage(donnees) {
    if (nbErreursEnvoi == 0) {
        nbMessagesEnTout++;

        var msg = "activité : " + nbMessagesEnTout;

        if (nbMessagesEnCours > 0)
            msg += "/" + nbMessagesEnCours;

        $("#etatConnexion").html(msg);
    }

    nbMessagesEnCours++;
    dernieresDonnees = donnees;

    var result = $.ajax({
        type: "POST", url: "ajax.php", cache: false, dataType: "json", data: donnees, timeout: 30000,
        success: envoiMessageReussi, error: envoiMessageRate });

    if (result == undefined)
        afficherEcranConnexion("Erreur fatale : impossible de créer l'objet Ajax. Merci de rapporter ceci à Anomaly.");
}

function envoiMessageReussi(recept) {
    nbMessagesEnCours--;

    if (nbMessagesEnCours < 0)
        nbMessagesEnCours = 0;

    if (nbErreursEnvoi > 0) {
        nbErreursEnvoi = 0;
        $("#etatConnexion").html("connexion rétablie");
        $("#nombreConnectes").html("Résolu");
        $("#dialogueConnexionInstable").dialog("close");
        $("#zoneSaisie").focus();
    }

    if (recept.etat > 0)
        afficherEcranChat(recept);
    else if (recept.etat == 0)
        afficherEcranConnexion(recept.message);
    else
        envoyerReconnexionAutomatique();
}

function envoiMessageRate() {
    nbMessagesEnCours--;

    if (ecranActuel == 0)
        afficherEcranConnexion("Erreur pendant la tentative de connexion. Merci de réessayer.");
    else {
        nbErreursEnvoi++;
        $("#etatConnexion").html("connexion instable (#" + nbErreursEnvoi + ")");

        if (nbErreursEnvoi == 1) {
            $("#nombreConnectes").html("Erreur");
            $("#dialogueConnexionInstable").dialog("open");
        }
    }
}

/* Fonctions de notification de nouveau message */

function activerIndicateurNouveauMessage() {
    if (indicateurNouveauMessage == 0 && optionsChat.indexOf("D") == -1)
        indicateurNouveauMessage = 1;
}

function desactiverIndicateurNouveauMessage() {
    if (indicateurNouveauMessage != 0) {
        indicateurNouveauMessage = 2;
        alternerIndicateurNouveauMessage();
        indicateurNouveauMessage = 0;
    }
}

function alternerIndicateurNouveauMessage() {
    if (indicateurNouveauMessage == 1) {
        document.title = "Nouveau message";
        indicateurNouveauMessage = 2;
    } else if (indicateurNouveauMessage == 2) {
        document.title = pseudo + " - " + titreInitial;
        indicateurNouveauMessage = 1;
    }
}

function majCompteurAccepterRegles() {
    if (compteurAccepterRegles > 0) {
        compteurAccepterRegles--;

        if (compteurAccepterRegles > 0)
            $("#dlgReglesAccepter").val("Patientez... (" + compteurAccepterRegles + ")");
        else {
            $("#dlgReglesDelai").html("");
            activer($("#dlgReglesAccepter").val("J'ai lu et j'accepte les règles"));
        }
    }
}

/* Fonctions de cookies */

function ecrireCookie(nom, valeur, jours) {
    var expDate = new Date();
    expDate.setTime(expDate.getTime() + (jours * 24 * 3600 * 1000));
    document.cookie = nom + "=" + escape(valeur) + ";expires=" + expDate.toGMTString();
}

function effacerCookie(nom) {
    ecrireCookie(nom, "", -1);
}

function lireCookie(nom) {
    var deb = document.cookie.indexOf(nom + "=");

    if (deb >= 0) {
        deb += nom.length + 1;
        var fin = document.cookie.indexOf(";", deb);

        if (fin < 0)
            fin = document.cookie.length;

        return unescape(document.cookie.substring(deb, fin));
    }

    return null;
}

/* Fonctions pour les paramètres */

function lireParamGet(nom) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0; i<vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == nom)
            return pair[1];
    }
    return undefined;
}

/* Fonctions principales */

$(function() {
    // associations des événements fenêtre
    titreInitial = document.title;
    $(window).unload(quitterChat);
    $(window).resize(dimensionner);
    $(window).keypress(clavierGeneral);
    document.onmousemove = deplacementCurseurSouris;

    // associations des événements clavier
    $("#identPseudo").keypress(clavierEcranIdentification);
    $("#identMdp").keypress(clavierEcranIdentification);
    gererClavier($("#zoneSaisie"), clavierEcranChat);
    gererClavier($("#dlgCodeContenu"), clavierDlgCode);
    gererToucheEntreeDialogue($("#dlgStatutTexte"), actionChangerStatut);
    gererToucheEntreeDialogue($("#dlgInsererLienUrl"), actionInsererLien);
    gererToucheEntreeDialogue($("#dlgInsererLienLibelle"), actionInsererLien);
    gererToucheEntreeDialogue($("#dlgInsererImageUrl"), actionInsererImage);
    gererToucheEntreeDialogue($("#dlgMsgGenTexte"), actionEnvoyerMessageGeneral);
    gererToucheEntreeDialogue($("#dlgCreerSalonNom"), actionCreerSalon);
    gererToucheEntreeDialogue($("#dlgExpMotif"), actionExpulser);
    gererToucheEntreeDialogue($("#dlgForcerLectureReglesMessage"), actionForcerLectureRegles);
    gererToucheEntreeDialogue($("#dlgForcerCouleurCode"), actionForcerCouleur);
    gererToucheEntreeDialogue($("#dlgForcerStatutTexte"), actionForcerStatut);
    gererToucheEntreeDialogue($("#dlgChangerNomSalon2"), actionChangerNomSalon3);
    gererToucheEntreeDialogue($("#dlgChangerDescSalon2"), actionChangerDescSalon3);

    // associations des actions des boutons
    $("#identEffacer").click(effacerConnexionAutomatique);
    $("#identAction").click(connecterUtilisateur);
    $("#modcp").click(panneauModeration);
    $("#reduireListe").click(reduireListe);
    $("#developperListe").click(developperListe);
    $("#quitterChat").click(quitterChat);
    $("#insererImage").click(insererImage);
    $("#insererLien").click(insererLien);
    $("#afficherAide").click(afficherAide);
    $("#envoyer").click(envoyerTexte);
    $("#effacer").click(boutonEffacer);
    $("#changerStatut").click(changerStatut);
    $("#options").click(modifierOptions);
    $("#insererCode").click(insererCode);
    $("#insererQuote").click(insererQuote);
    $("#afficherListeSmileys").click(afficherListeSmileys);
    $(".ajouterBalise").click(ajouterBalise);
    $("#selecteurCouleur").attachColorPicker().change(changerCouleur);
    $("#dlgStatutAction").click(actionChangerStatut);
    $("#dlgOptionsAction").click(actionModifierOptions);
    $("#dlgCodeAction").click(actionInsererCode);
    $("#dlgInviteAction").click(actionInviter);
    $("#dlgExpAction").click(actionExpulser);
    $("#dlgCreerSalonAction").click(actionCreerSalon);
    $("#dlgMsgGenAction").click(actionEnvoyerMessageGeneral);
    $("#dlgForcerLectureReglesAction").click(actionForcerLectureRegles);
    $("#dlgReglesAccepter").click(accepterRegles);
    $("#dlgReglesRefuser").click(quitterChat);
    $("#dlgInsererImageAction").click(actionInsererImage);
    $("#dlgInsererLienAction").click(actionInsererLien);
    $("#dlgBloquerAction").click(actionBloquer);
    $("#dlgMessageAction").click(actionMessage);
    $("#dlgForcerCouleurAction").click(actionForcerCouleur);
    $("#dlgForcerStatutAction").click(actionForcerStatut);
    $("#dlgChangerNomSalon1").click(actionChangerNomSalon1);
    $("#dlgChangerNomSalon3").click(actionChangerNomSalon3);
    $("#dlgChangerDescSalon1").click(actionChangerDescSalon1);
    $("#dlgChangerDescSalon3").click(actionChangerDescSalon3);
    $("#dlgPasserSalonPublic").click(actionPasserSalonPublic);
    $("#dlgPasserSalonPrive").click(actionPasserSalonPrive);
    $("#dlgActiverMuet").click(actionActiverMuet);
    $("#dlgDesactiverMuet").click(actionDesactiverMuet);
    $("#dlgActiverDice").click(actionActiverDice);
    $("#dlgDesactiverDice").click(actionDesactiverDice);

    // associations des changements d'élément sélectionnés dans les listes ou les boutons radios
    $("#dlgStatutListePredef").change(function() { cocher($("#dlgStatutPredef")); });
    $("#dlgStatutPerso").click(function() { $("#dlgStatutTexte").focus(); });
    $("#dlgStatutTexte").click(function() { cocher($("#dlgStatutPerso")); });
    $("#dlgStatutNonDisponible").click(clicOptionStatutPerso);
    $("#dlgStatutNePasDeranger").click(clicOptionStatutPerso);
    $("#dlgCodeColoration").change(function() { $("#dlgCodeContenu").focus(); });

    // initialisation des boîtes de dialogue
    creerBoiteDlgFixe("#dialogueLireRegles", "Vous devez lire et accepter les règles avant de continuer", 600, 400);
    creerBoiteDlgFixe("#dialogueConnexionInstable", "Connexion instable", 350, 130);
    $(".ui-dialog-titlebar-close").hide();

    creerBoiteDlgFixe("#dialogueStatut", "Changer le statut", 550, 260);
    creerBoiteDlgFixe("#dialogueOptions", "Modifier les options", 550, 280);
    creerBoiteDlgFixe("#dialogueCode", "Poster du code", 590, 380);
    creerBoiteDlgFixe("#listeSmileys", "Liste des smileys", 550, 240);
    creerBoiteDlgFixe("#dialogueInviter", "Inviter un utilisateur", 450, 185);
    creerBoiteDlgFixe("#dialogueExpulsion", "Expulser un utilisateur", 450, 195);
    creerBoiteDlgFixe("#dialogueCreerSalon", "Créer un salon", 400, 130);
    creerBoiteDlgFixe("#dialogueOptionsSalon", "Changer les options du salon", 550, 140);
    creerBoiteDlgFixe("#dialogueMessageGeneral", "Envoyer un message général", 690, 160);
    creerBoiteDlgFixe("#dialogueForcerLectureRegles", "Forcer la lecture des règles", 610, 285);
    creerBoiteDlgFixe("#dialogueInsererImage", "Insérer une image", 560, 150);
    creerBoiteDlgFixe("#dialogueInsererLien", "Insérer un lien", 510, 130);
    creerBoiteDlgFixe("#dialogueBloquer", "Bloquer un correspondant", 460, 240);
    creerBoiteDlgFixe("#dialogueMessage", "Message", 530, 120);
    creerBoiteDlgFixe("#dialogueForcerCouleur", "Changer la couleur d'un utilisateur", 450, 140);
    creerBoiteDlgFixe("#dialogueForcerStatut", "Changer le statut d'un utilisateur", 650, 200);

    // lecture des paramètres GET
    salonForce = lireParamGet("salon");
    if (salonForce == undefined || $("#divSalonConnexion" + salonForce).val() == undefined)
        salonForce = 0;

    // activation de l'écran de connexion
    afficherEcranConnexion("Connectez-vous avec vos identifiants du forum.");
});

function changerEtat(elem, attr, etat) {
    elem.attr(attr, etat);
    return elem;
}

function cocher(elem) {
    return changerEtat(elem, "checked", true);
}

function decocher(elem) {
    return changerEtat(elem, "checked", false);
}

function activer(elem) {
    return changerEtat(elem, "disabled", false);
}

function desactiver(elem) {
    return changerEtat(elem, "disabled", true);
}

function estCochee(elem) {
    return elem.is(":checked");
}

function estActif(elem) {
    return ! elem.is(":disabled");
}

function gererClavier(objet, fonction) {
    objet.keydown(fonction);
    return objet;
}

function gererToucheEntreeDialogue(objet, action) {
    return gererClavier(objet, function(ev) {
        if (ev.keyCode == 13) {
            action();
            return false;
        } else
            return true;
    });
}

function creerBoiteDlgFixe(motif, titre, largeur, hauteur) {
    $(motif).dialog({ autoOpen: false, title: titre, resizable: false, width: largeur, height: hauteur });
}

function protegerPseudo(pseudo) {
    return pseudo.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function afficherEcranConnexion(message) {
    clearInterval(timer);
    ecranActuel = 0;
    pseudo = "";
    motDePasseChiffre = "";
    listeOnglets = new Array();

    document.title = titreInitial;
    $("body").attr("onBeforeUnload", "");
    $(".onglet").remove();
    $(".conversation").remove();
    $(".boiteDialogue").dialog("close");
    $("#menuUtilisateur").hide();
    $("#zoneSaisie").blur();
    $("#ecranChat").hide();
    $("#ecranIdentification").show();
    $("#identMessage").html(message);
    $("#identPseudo").html("");
    $("#identMotdepasse").html("");
    activer($("#identAction"));
    $("body").removeClass("fondBlanc");
    decocher($("#identNoPv"));
    decocher($("#identDiscret"));
    decocher($("#identSansImages"));
    decocher($("#identMono"));

    if ($("input[name='salonConnexion']:checked").val() != undefined)
        decocher($("input[name='salonConnexion']:checked"));

    if (salonForce) {
        $(".divSalonConnexion").hide();
        $("#divSalonConnexion" + salonForce).show();
        cocher($("#salonConnexion" + salonForce));
    }

    var pseudoMemorise = lireCookie("anochat_pseudo");

    if (pseudoMemorise == null) {
        $("#identMemorisee").hide();
        $("#identNonMemorisee").show();
        $("#identPseudo").focus();
        decocher(activer($("#identMemoriser")));

    } else {
        $("#identNonMemorisee").hide();
        $("#identMemorisee").show();
        $("#identMemorisee > b").html(pseudoMemorise);
        cocher(desactiver($("#identMemoriser")));

        if (! salonForce)
            cocher($("#salonConnexion" + lireCookie("anochat_salon")));

        if (lireCookie("anochat_options").indexOf("B") != -1)
            cocher($("#identNoPv"));
        if (lireCookie("anochat_options").indexOf("D") != -1)
            cocher($("#identDiscret"));
        if (lireCookie("anochat_options").indexOf("I") != -1)
            cocher($("#identSansImages"));
        if (lireCookie("anochat_options").indexOf("M") != -1)
            cocher($("#identMono"));
    }
}

function afficherEcranChat(d) {
    if (ecranActuel == 0) {
        $("#identPseudo").blur();
        $("#identMdp").blur();
        $("#ecranIdentification").hide();
        creerOnglet(0, "Salon");
        activerOnglet(0);
        $("#ecranChat").show();
        cocher($("#dlgStatutAucun"));
        $("#dlgStatutTexte").val("");
        decocher($("#dlgStatutNonDisponible"));
        $("#dlgCodeColoration").val("?");

        $("#zoneSaisie").val("").focus();
        $("body").addClass("fondBlanc");
        dimensionner();

        ancienSalon = "";
        nbMessagesEnTout = 0;
        nbMessagesEnCours = 0;
        nbErreursEnvoi = 0;
        $("#etatConnexion").html("connexion établie");

        ecranActuel = 1;
        modeForcerRegles = false;
        indicateurNouveauMessage = 0;
        compteurAccepterRegles = 0;
        alternateur = 0;
        timer = setInterval(timerPrincipal, 1000);

        if (estCochee($("#identMemoriser"))) {
            var duree = 30;
            ecrireCookie("anochat_pseudo", d.pseudo, duree);
            ecrireCookie("anochat_motdepasse", d.motdepasse, duree);
            ecrireCookie("anochat_salon", salonConnexion, duree);
            ecrireCookie("anochat_options", optionsChat, duree);
        }

        if (salonForce) {
            $(".divSalonConnexion").show();
            salonForce = 0;
        }
    }

    if (d.nb != undefined)
        $("#nombreConnectes").html(d.nb + " connectés");

    if (d.salon != "") {
        if (d.notifSalon == 1)
            notifierOngletActivite(0);

        if (d.notifSalon == 2) {
            activerIndicateurNouveauMessage();
            notifierOngletMessage(0);
        }

        ajouterTexte($("#conversation0"), d.salon);
    }

    if (d.connectes != "") {
        $("#connectes").html(d.connectes);
        listeCompletion = eval(d.listeCompletion);
    }

    for (i in d.pvs) {
        creerOnglet(d.pvs[i].id, d.pvs[i].pseudo);
        ajouterTexte($("#conversation" + d.pvs[i].id), d.pvs[i].html);

        if (    d.pvs[i].html.indexOf("[" + pseudo + "]: ", 0) == -1 &&
                d.pvs[i].html.indexOf("* " + pseudo + " ", 0) == -1 &&
                d.pvs[i].html.indexOf("et donc risque de ne pas répondre tout de suite.") == -1 &&
                d.pvs[i].html.indexOf("a demandé à ne pas être dérangé(e)") == -1 &&
                d.pvs[i].html.indexOf("vous a bloqué(e).") == -1 &&
                d.pvs[i].html.indexOf("parce que vous l'avez bloqué(e).") == -1 &&
                d.pvs[i].html.indexOf("n'est plus connecté(e).") == -1) {
            /* nouveau message entrant qui n'est ni erreur, ni message de moi */

            notifierOngletMessage(d.pvs[i].id);
            activerIndicateurNouveauMessage();
        }
    }

    if (d.etat == 2) {
        $("#zonePseudo").html(d.pseudo);
        $(".ColorPickerDivSample").css("background-color", d.couleur);
        $("#dlgListeSmileysPersos").html(d.smileys);
        couleurInitiale = d.couleur;
        session = d.session;
        optionsChat = d.options;

        if (d.statut != "")
            $("#dlgStatutTexte").val(d.statut);

        if (d.nomSalon != ancienSalon) {
            ancienSalon = d.nomSalon;
            renommerOngletSalon("Salon " + d.nomSalon);
            activerOnglet(0);
        }

        if (optionsChat.indexOf("D") != -1) {
            desactiverIndicateurNouveauMessage();
            document.title = "Recherche Google";
            $("body").attr("onBeforeUnload", "");
            cocher($("#dlgOptDiscret"));
        } else {
            document.title = d.pseudo + " - " + titreInitial;
            $("body").attr("onBeforeUnload", "return('Vous allez être déconnectée(e) du Chat.')");
            decocher($("#dlgOptDiscret"));
        }

        if (optionsChat.indexOf("M") != -1) {
            $("#ecranChat").addClass("mono");
            $(".bouton").addClass("mono");
            $("#barreOnglets").addClass("mono");
            $("#barreStatut").addClass("mono");
            $("#zoneSaisie").addClass("mono");
            $("#zonePseudo").addClass("mono");
            $(".nomSalon").addClass("mono");
            $(".ColorPickerDivSample").hide();
            cocher($("#dlgOptMono"));
        } else {
            $("#ecranChat").removeClass("mono");
            $(".bouton").removeClass("mono");
            $("#barreOnglets").removeClass("mono");
            $("#barreStatut").removeClass("mono");
            $("#zoneSaisie").removeClass("mono");
            $("#zonePseudo").removeClass("mono");
            $(".nomSalon").removeClass("mono");
            $(".ColorPickerDivSample").show();
            decocher($("#dlgOptMono"));
        }

        if (optionsChat.indexOf("R") != -1) {
            $("#reduireListe").hide();
            $("#developperListe").show();
        } else {
            $("#developperListe").hide();
            $("#reduireListe").show();
        }

        if (optionsChat.indexOf("B") != -1)
            cocher($("#dlgOptNoPv"));
        else
            decocher($("#dlgOptNoPv"));

        if (optionsChat.indexOf("I") != -1)
            cocher($("#dlgOptSansImages"));
        else
            decocher($("#dlgOptSansImages"));

        pseudo = d.pseudo;
        motDePasseChiffre = d.motdepasse;

        if (d.niveau < 2)
            $("#modcp").hide();
        else
            $("#modcp").show();

        if (d.regles != "") {
            modeForcerRegles = true;
            $("#dialogueLireRegles").dialog("open").children("div").get(0).scrollTop = 0;

            for (var r = 1; r <= 12; ++r)
                $("#regle" + r).hide();

            var regles = eval(d.regles);
            var r_liste = regles[0];
            var r_nbLectures = regles[1];
            var r_delai = regles[2];
            var r_bourreau = regles[3];
            var r_message = regles[4];

            for (r = 0; r < r_liste.length; ++r)
                $("#regle" + r_liste[r]).show();

            if (r_message != "")
                $("#dlgReglesMessage").show().html("Note du modérateur : " + r_message);
            else
                $("#dlgReglesMessage").hide();

            $("#dlgReglesBourreau").html("Ce rappel des règles vous est fait par " + r_bourreau + ".");

            $("#dlgReglesDelai").html((r_nbLectures > 1 ? "C'est la " + r_nbLectures + "ème fois que vous ne respectez pas les règles. " : "") +
                "Vous devez attendre " + r_delai + " secondes avant de pouvoir confirmer que vous avez lu et accepté les règles.");

            desactiver($("#dlgReglesAccepter"));
            compteurAccepterRegles = r_delai;
            majCompteurAccepterRegles();
            activerIndicateurNouveauMessage();

        } else if (modeForcerRegles) {
            modeForcerRegles = false;
            $("#dialogueLireRegles").dialog("close");
        }
    }

    if (d.message != undefined && d.message != "") {
        $("#dialogueMessage").dialog("open");
        $("#dlgMessageTexte").html(d.message);
    }
}

function deplacementCurseurSouris(e) {
    desactiverIndicateurNouveauMessage();

    if (e) {
        // Tous les bons navigateurs
        sourisX = e.pageX;
        sourisY = e.pageY;
    } else {
        // Internet Explorer
        var docRef;

        sourisX = event.clientX;
        sourisY = event.clientY;

        //-- Il faut traiter le CAS des DOCTYPE sous IE
        if (document.documentElement && document.documentElement.clientWidth)
            docRef = document.documentElement; // doctype-switching actif
        else
            docRef = document.body;

        sourisX += docRef.scrollLeft;
        sourisY += docRef.scrollTop;
    }
}

function ajouterTexte(objet, texte) {
    var controle = objet.get(0);
    var defil = (controle.scrollTop + controle.offsetHeight) >= controle.scrollHeight;

    objet.append(texte);

    if (defil)
        defiler(controle);
}

function defiler(controle) {
    controle.scrollTop = controle.scrollHeight + 9999;
}

function dimensionner() {
    var hauteur = window.innerHeight; // fonctionne sur tous les bons navigateurs

    if (hauteur == undefined)
        hauteur = document.documentElement.clientHeight; // on a affaire à un mauvais navigateur
    if (hauteur == undefined)
        hauteur = document.body.clientHeight; // ou à une ancienne version d'un mauvais navigateur

    hauteur -= 30;
    var hauteurBarreBoutons = $("#barreOutils").height();
    $("#ecranChat").css("height", hauteur + "px");
    var liste = $(".conversation").css("height", (hauteur - 111 - hauteurBarreBoutons) + "px");
    $("#connectes").css("height", (hauteur - 74) + "px");
    $("#barreOutils").css("top", (hauteur - 66 - hauteurBarreBoutons) + "px");
    $("#conteneurZoneSaisie").css("top", (hauteur - 61) + "px");

    for (var i = 0; i < liste.length; ++i)
        defiler(liste.get(i));
}

function clavierGeneral(ev) {
    return ev.keyCode != 27;
}

function clavierEcranIdentification(ev) {
    if (ev.keyCode == 13 && estActif($("#identAction"))) {
        connecterUtilisateur();
        return false;
    }

    return true;
}

function effacerConnexionAutomatique() {
    effacerCookie("anochat_pseudo");
    effacerCookie("anochat_motdepasse");
    effacerCookie("anochat_salon");
    effacerCookie("anochat_options");
    afficherEcranConnexion("Tous les cookies ont été effacés !");
}

function connecterUtilisateur() {
    var identifiant = lireCookie("anochat_pseudo");
    var motdepasse = lireCookie("anochat_motdepasse");
    var mode = 1;

    if (identifiant == null) {
        mode = 0;

        identifiant = $("#identPseudo").val();
        motdepasse = $("#identMdp").val();

        if (identifiant == "") {
            $("#identMessage").html("Vous devez entrer votre identifiant.");
            $("#identPseudo").focus();
            return;
        }

        if (motdepasse == "") {
            $("#identMessage").html("Vous devez entrer votre mot de passe.");
            $("#identMdp").focus();
            return;
        }
    }

    salonConnexion = $("input[name='salonConnexion']:checked").val();

    if (salonConnexion == undefined) {
        $("#identMessage").html("Vous devez choisir un salon.");
        return;
    }

    if (mode == 0) {
        $("#identPseudo").val("").focus();
        $("#identMdp").val("");
    }

    $("#identMessage").html("Connexion en cours...");
    desactiver($("#identAction"));

    optionsChat = "";
    if (estCochee($("#identNoPv")))
        optionsChat += "B";
    if (estCochee($("#identDiscret")))
        optionsChat += "D";
    if (estCochee($("#identSansImages")))
        optionsChat += "I";
    if (estCochee($("#identMono")))
        optionsChat += "M";

    envoyerConnexion(identifiant, motdepasse, mode, salonConnexion);
}

/* Gestion du clavier */

function clavierEcranChat(ev) {
    desactiverIndicateurNouveauMessage();
    effacerMessageCompletion();

    if (ev.keyCode == 13 && !ev.shiftKey) {
        if (suiteTouchesTab > 1)
            return completerElementSelectionne();

        envoyerTexte();
        return false;

    } else if (toucheCompletion(ev))
        return completer($("#zoneSaisie"));

    else if (toucheChangementOnglet(ev))
        return changerOnglet(ev);

    suiteTouchesTab = 0;
    return true;
}

function toucheCompletion(ev) {
    return ev.keyCode == 9 && !ev.shiftKey && !ev.ctrlKey && !ev.altKey;
}

function toucheChangementOnglet(ev) {
    return (ev.keyCode == 37 || ev.keyCode == 39)  && !ev.shiftKey && ev.ctrlKey && !ev.altKey;
}

function str_replace(motif, rempl, chaine) {
    var pos;

    while ((pos = chaine.indexOf(motif)) != -1)
        chaine = chaine.substr(0, pos) + rempl + chaine.substring(pos + motif.length);

    return chaine;
}

function messageCompletion(message) {
    if (messageCompletionTimer != undefined)
        clearTimeout(messageCompletionTimer);
    $("#messageCompletion").html(message).show();
    messageCompletionTimer = setTimeout(function() { messageCompletionTimer = undefined; $("#messageCompletion").fadeOut(); }, 5000);
}

function effacerMessageCompletion() {
    if (messageCompletionTimer != undefined) {
        clearTimeout(messageCompletionTimer);
        $("#messageCompletion").hide();
    }
}

function lienElementCompletion(element, pos) {
    return "<span style='font-weight: bold; cursor: pointer' id='elementcompl" + pos
        + "' onclick='clicElementCompletion(\"" + element + "\"); return false;'>" + element + "</span>";
}

function clicElementCompletion(element) {
    var zone = $("#zoneSaisie");
    var texte = zone.val();
    var debut = texte.length - 1;

    while (debut >= 1 && texte.charCodeAt(debut - 1) != 32)
        debut--;

    zone.focus().val(zone.val().substr(0, debut) + str_replace(" ", "_", element));
    completer(zone);
}

function completerElementSelectionne() {
    clicElementCompletion($(".elementcomplsel").text());
    suiteTouchesTab = 0;
    return false;
}

function completer(zone) {
    var texte = zone.val();
    var debut = texte.length - 1;

    if (debut == -1 || texte.charCodeAt(debut) == 32)
        return true;

    while (debut >= 1 && texte.charCodeAt(debut - 1) != 32)
        debut--;

    var motif = texte.substring(debut).toUpperCase();
    var occurrences = new Array();

    for (var i = 0; i < listeCompletion.length; ++i) {
        var element = listeCompletion[i];

        if (str_replace(" ", "_", element.substr(0, motif.length).toUpperCase()) == motif)
            occurrences.push(i);
    }

    if (occurrences.length == 0) {
        messageCompletion("Aucune correspondance.");
        return false;

    } else if (occurrences.length == 1) {
        var result = listeCompletion[occurrences[0]];

        if (texte.substr(0, 1) != "/" && texte.substr(0, 1) != "!" && (debut == 0 || texte.substr(debut - 2, 2) == "> "))
            texte = texte.substr(0, debut) + result + "> ";
        else if (texte.substr(0, 1) == "/")
            texte = texte.substr(0, debut) + str_replace(" ", "_", result) + " ";
        else
            texte = texte.substr(0, debut) + result + " ";

        effacerMessageCompletion();
    } else {
        var message = "Correspondances : " + lienElementCompletion(listeCompletion[occurrences[0]], 0);
        var tailleMax = listeCompletion[occurrences[0]].length;

        for (var i = 1; i < occurrences.length; ++i) {
            message += ", " + lienElementCompletion(listeCompletion[occurrences[i]], i);
            while (listeCompletion[occurrences[i]].substr(0, tailleMax).toUpperCase() != listeCompletion[occurrences[0]].substr(0, tailleMax).toUpperCase())
                tailleMax--;
        }

        messageCompletion(message);
        texte = texte.substr(0, debut) + str_replace(" ", "_", listeCompletion[occurrences[0]].substr(0, tailleMax).toLowerCase());

        if (suiteTouchesTab > 0) {
            if ($("#elementcompl" + (suiteTouchesTab - 1)).get(0) == undefined)
                suiteTouchesTab = 1;
            $("#elementcompl" + (suiteTouchesTab - 1)).addClass("elementcomplsel");
        }

        suiteTouchesTab++;
    }

    zone.val(texte);
    return false;
}

function envoyerTexte() {
    if (! peutEnvoyerCommande())
        return;

    var texte = $("#zoneSaisie").val().replace(/\s+$/g, "");
    var texteMaj = texte.toUpperCase();
    var conversation = lireOngletActuel();

    $("#zoneSaisie").val("").focus();

    if (texte == "")
        return;

    if (texteMaj == "/CLEAR")
        effacer();
    else if (texteMaj == "/CLOSE")
        fermerOngletActuel();
    else if (conversation == 0 || (texteMaj.substr(0, 1) == "/" && texteMaj.substr(1, 3) != "ME " && texteMaj.substr(1, 5) != "DICE "))
        envoyerCommande(texte);
    else
        envoyerCommande("/TELL " + conversation + " " + texte);
}

/* Gestion des onglets */

function lireOngletActuel() {
    return $(".ongletActuel").attr("id").substr(6);
}

function creerOnglet(id, titre) {
    if ($("#onglet" + id).html() != undefined)
        $("#onglet" + id).show();
    else {
        $("#barreOnglets").append(
            '<div id="onglet' + id + '" class="onglet ongletNormal"><table><tr><td>' + titre +
            '</td><td><div class="fermeture"></div></td></tr></table></div>');

        $("#onglet" + id).click(function() { activerOnglet(id); });
        $("#onglet" + id + " .fermeture").click(function() { fermerOnglet(id); }).hide();

        $("#conversations").append('<div id="conversation' + id + '" class="conversation"></div>');
        $("#conversation" + id).mouseover(survolZoneConversation).hide();

        dimensionner();
        listeOnglets.push(id);
    }
}

function survolZoneConversation() {
    if ($("#menuUtilisateur").css("display") == "block") {
        $("#menuUtilisateur").hide();
        $("#zoneSaisie").focus();
    }
}

function renommerOngletSalon(titre) {
    $("#onglet0").html('<table><tr><td>' + titre + '</td><td><div class="fermeture" style="display: none"></div></td></tr></table>');
}

function notifierOngletMessage(id) {
    var onglet = $("#onglet" + id);

    if (! onglet.hasClass("ongletMessage") && ! onglet.hasClass("ongletActuel"))
        onglet.removeClass("ongletActivite").addClass("ongletMessage");
}

function notifierOngletActivite(id) {
    var onglet = $("#onglet" + id);

    if (! onglet.hasClass("ongletMessage") && ! onglet.hasClass("ongletActivite") && ! onglet.hasClass("ongletActuel"))
        onglet.addClass("ongletActivite");
}

function activerOnglet(id) {
    var ancienOnglet = $(".ongletActuel");
    var nouvelOnglet = $("#onglet" + id);

    if (nouvelOnglet.css("display") == "none")
        return;

    $(".onglet .fermeture").hide();
    ancienOnglet.removeClass("ongletActuel").addClass("ongletNormal");
    nouvelOnglet.removeClass("ongletNormal").removeClass("ongletMessage").removeClass("ongletActivite").addClass("ongletActuel");

    if (id != 0)
        $("#onglet" + id + " .fermeture").show();

    $(".conversation").hide();
    $("#conversation" + id).show();
    defiler($("#conversation" + id).get(0));

    $("#zoneSaisie").val("").removeClass("saisieSalon").removeClass("saisiePrive").removeClass("saisieModo").addClass("saisie" +
        (id == -1 ? "Modo" : id == 0 ? "Salon" : "Prive")).focus();
}

function fermerOnglet(id) {
    $("#onglet" + id).hide();
    activerOnglet(0);
}

function fermerOngletActuel() {
    var ongletActuel = lireOngletActuel();

    if (ongletActuel != 0)
        fermerOnglet(ongletActuel);
}

function changerOnglet(ev) {
    if ($("#zoneSaisie").val() != "")
        return true;

    var ongletActuel = lireOngletActuel();
    var posOngletActuel = 0;

    while (listeOnglets[posOngletActuel] != ongletActuel)
        ++posOngletActuel;

    var sens = ev.keyCode == 37 ? -1 : +1;
    var posNouvelOnglet = posOngletActuel;

    for (;;) {
        posNouvelOnglet += sens;

        if (posNouvelOnglet < 0)
            posNouvelOnglet = listeOnglets.length - 1;
        else if (posNouvelOnglet == listeOnglets.length)
            posNouvelOnglet = 0;

        if (posNouvelOnglet == posOngletActuel)
            return false; // aucune correspondance

        if ($("#onglet" + listeOnglets[posNouvelOnglet]).css("display") != "none") {
            activerOnglet(listeOnglets[posNouvelOnglet]);
            return false;
        }
    }
}

/* Gestion des options de menu et des boutons */

function afficherAide() {
    window.open("aide", "aide");
}

function positionnerCurseurFin() {
    // seuls Chrome et Safari ont besoin de cette fonction

    var editeur = $("#zoneSaisie").get(0);

    if (editeur.setSelectionRange) {
        var position = editeur.value.length;
        editeur.setSelectionRange(position, position);
    }
}

function insererBalise(debut, fin) {
    var editeur = $("#zoneSaisie").get(0);

    if (editeur.setSelectionRange) {
        // Code pour les bons navigateurs

        var debutSel = editeur.selectionStart;
        var finSel = editeur.selectionEnd;
        var texte = editeur.value;
        var position = debutSel + debut.length;

        editeur.value = texte.slice(0, debutSel) + debut + texte.slice(debutSel, finSel) + fin + texte.slice(finSel);
        editeur.focus();
        editeur.setSelectionRange(position, position);

    } else {
        // Code pour Internet Explorer uniquement

        var sel = document.selection.createRange();

        if (sel.parentElement() == editeur && sel.text != "") {
            sel.text = debut + sel.text + fin;
            editeur.focus();
        } else {
            editeur.value = editeur.value + debut + fin;
            sel = editeur.createTextRange();
            sel.move("character", editeur.value.length - fin.length);
            sel.select();
        }
    }
}

function ajouterBalise() {
    var balise = $(this).val();
    insererBalise("[" + balise + "]", "[/" + balise + "]");
}

function insererQuote() {
    insererBalise("[QUOTE]", "");
}

function changerCouleur() {
    couleurInitiale = $("#selecteurCouleur").val();
    envoyerCommande("/COLOR " + couleurInitiale);
    $("#zoneSaisie").focus();
}

function reduireListe() {
    envoyerCommande("/MODE +R");
    $("#zoneSaisie").focus();
}

function developperListe() {
    envoyerCommande("/MODE -R");
    $("#zoneSaisie").focus();
}

function quitterChat() {
    if (ecranActuel != 0) {
        if (nbErreursEnvoi == 0)
            envoyerCommande("/QUIT");
        else
            afficherEcranConnexion("Vous vous êtes déconnecté(e) du Chat.");
    }
}

function accepterRegles() {
    modeForcerRegles = false;
    $("#dialogueLireRegles").dialog("close");
    envoyerCommande("/ACCEPT");
    $("#zoneSaisie").focus();
}

function boutonEffacer() {
    if (confirm("Ceci va effacer l'onglet courant de conversation. Êtes-vous sûr(e) ?"))
        effacer();
    else
        $("#zoneSaisie").focus();
}

function effacer() {
    $("#conversation" + lireOngletActuel()).html("");
    $("#zoneSaisie").focus();
}

function afficherListeSmileys() {
    $("#listeSmileys").dialog("open").dialog("option", "height", $("#listeSmileys div").height() + 50).dialog("option", "position", "center");
    $("#zoneSaisie").focus();
}

function ajouterSmiley(code) {
    $("#zoneSaisie").val($("#zoneSaisie").val() + code).focus();
    $("#listeSmileys").dialog("close");
    positionnerCurseurFin();
}

function positionnerMenu(menu) {
    var x = sourisX;
    var y = sourisY;

    var dx = x + menu.width() + 20 - document.body.clientWidth + 5;
    var dy = y + menu.height() + 5 - document.body.clientHeight + 5;

    if (dx > 0)
        x -= dx;

    if (dy > 0)
        y -= dy;

    menu.css("left", x + "px").css("top", y + "px").show();
}

function ouvrirMenuUtilisateur(id, pseudo, dlgpub, dlgpv, ignore, invite, mod, liberer, voix, autoriser) {
    var menu = $("#menuUtilisateur");

    menu.html('<b>' + pseudo + '</b>');

    if (dlgpub)
        menu.append('<a href="#" onclick="parlerEnPublic(); return false;">Parler en public</a>');

    if (dlgpv) {
        menu.append('<a href="#" onclick="dialoguerEnPrive(' + id + '); return false;">Dialoguer en privé</a>');
        menu.append('<a href="#" onclick="envoyerFichier(' + id + '); return false;">Envoyer un fichier</a>');
    }

    menu.append('<a href="http://www.developpez.net/forums/member.php?u=' + id +
                '" onclick=\'$("#menuUtilisateur").hide()\' target="_blank">Voir le profil</a>');

    if (ignore == 0)
        menu.append('<a href="#" onclick="bloquer(' + id + '); return false;">Bloquer / Ignorer</a>');

    if (ignore == 1)
        menu.append('<a href="#" onclick="designorer(' + id + '); return false;">Débloquer</a>');

    if (ignore == 2)
        menu.append('<a href="#" onclick="designorer(' + id + '); return false;">Ne plus ignorer</a>');

    if (autoriser == 0)
        menu.append('<a href="#" onclick="autoriser(' + id + ', 1); return false;">Autoriser le privé</a>');

    if (autoriser == 1)
        menu.append('<a href="#" onclick="autoriser(' + id + ', 0); return false;">Interdire le privé</a>');

    if (voix == 0)
        menu.append('<a href="#" onclick="donnerVoix(' + id + '); return false;">Donner la voix</a>');

    if (voix == 1)
        menu.append('<a href="#" onclick="retirerVoix(' + id + '); return false;">Retirer la voix</a>');

    if (invite == 0)
        menu.append('<a href="#" onclick="inviter(' + id + '); return false;">Inviter</a>');

    if (invite == 1 || invite == 3)
        menu.append('<a href="#" onclick="desinviter(' + id + '); return false;">Annuler invitation</a>');

    if (invite == 2 || invite == 3)
        menu.append('<a href="#" onclick="emprisonner(' + id + '); return false;">Emprisonner</a>');

    if (mod) {
        menu.append('<a href="modcp?profil=' + id + '&s=' + session +
            '" onclick=\'$("#menuUtilisateur").hide()\' target="_blank">Dossier modération</a>');
        menu.append('<a href="#" onclick="expulser(' + id + '); return false;">Expulser</a>');
        menu.append('<a href="#" onclick="forcerLectureRegles(' + id + '); return false;">Faire lire les règles</a>');
        menu.append('<a href="#" onclick="forcerCouleur(' + id + '); return false;">Changer la couleur</a>');
        menu.append('<a href="#" onclick="forcerStatut(' + id + '); return false;">Changer le statut</a>');
    }

    if (liberer)
        menu.append('<a href="#" onclick="liberer(' + id + '); return false;">Libérer</a>');

    positionnerMenu(menu);
}

function parlerEnPublic() {
    $("#menuUtilisateur").hide();
    $("#zoneSaisie").val($("#menuUtilisateur > b").text() + "> " + $("#zoneSaisie").val()).focus();
    positionnerCurseurFin();
}

function dialoguerEnPrive(id) {
    $("#menuUtilisateur").hide();
    creerOnglet(id, $("#menuUtilisateur > b").text());
    activerOnglet(id);
}

function actionMessage() {
    $("#dialogueMessage").dialog("close");
    $("#zoneSaisie").focus();
}

function bloquer(id) {
    $("#menuUtilisateur").hide();
    $("#dialogueBloquer").dialog("open");
    $("#dlgBloquerPseudo").html($("#menuUtilisateur > b").html()).attr("monId", id);
    cocher($("#dlgBloquerRien").focus());
}

function actionBloquer() {
    var id = $("#dlgBloquerPseudo").attr("monId");
    $("#dialogueBloquer").dialog("close");

    if (estCochee($("#dlgBloquerBlo")))
        envoyerCommande("/IGNORE BLOCK " + id);
    if (estCochee($("#dlgBloquerIgn")))
        envoyerCommande("/IGNORE FULL " + id);

    $("#zoneSaisie").focus();
}

function designorer(id) {
    $("#menuUtilisateur").hide();
    envoyerCommande("/IGNORE OFF " + id);
    $("#zoneSaisie").focus();
}

function autoriser(id, mode) {
    $("#menuUtilisateur").hide();
    envoyerCommande("/ALLOW " + (mode ? "ON" : "OFF") + " " + id);
    $("#zoneSaisie").focus();
}

function changerVoixGenerique(id, arg) {
    $("#menuUtilisateur").hide();
    envoyerCommande("/VOICE " + arg + " " + id);
    $("#zoneSaisie").focus();
}

function donnerVoix(id) {
    changerVoixGenerique(id, "ON");
}

function retirerVoix(id) {
    changerVoixGenerique(id, "OFF");
}

function inviter(id) {
    $("#menuUtilisateur").hide();
    $("#dialogueInviter").dialog("open");
    $("#dlgInviteVictime").html("<b>" + $("#menuUtilisateur > b").html() + "</b> (id=" + id + ")").attr("monId", id);
    cocher($("#dlgInviteGentil").focus());
}

function actionInviter() {
    var id = $("#dlgInviteVictime").attr("monId");
    $("#dialogueInviter").dialog("close");

    if (estCochee($("#dlgInviteGentil")))
        inviterGenerique(id, "GENTLE");
    else if (estCochee($("#dlgInviteForcee")))
        inviterGenerique(id, "FORCED");
    else
        emprisonner(id);
}

function inviterGenerique(id, arg) {
    $("#menuUtilisateur").hide();
    envoyerCommande("/INVITE " + arg + " " + id);
    $("#zoneSaisie").focus();
}

function desinviter(id) {
    inviterGenerique(id, "OFF");
}

function emprisonner(id) {
    inviterGenerique(id, "JAILED");
}

function expulser(id) {
    $("#menuUtilisateur").hide();
    $("#dialogueExpulsion").dialog("open");
    $("#dlgExpVictime").html("<b>" + $("#menuUtilisateur > b").html() + "</b> (id=" + id + ")").attr("monId", id);
    $("#dlgExpMotif").val("").focus();
    $("#dlgExpBan").val("10");
    cocher($("#dlgExpSilencieuse"));
}

function actionExpulser() {
    var commande = "/BAN " + $("#dlgExpVictime").attr("monId") + " " + $("#dlgExpBan").val();

    if (estCochee($("#dlgExpSilencieuse")))
        commande += ",q";

    commande += " " + $("#dlgExpMotif").val();

    $("#dialogueExpulsion").dialog("close");
    envoyerCommande(commande);
    $("#zoneSaisie").focus();
}

function forcerLectureRegles(id) {
    $("#menuUtilisateur").hide();
    $("#dialogueForcerLectureRegles").dialog("open");
    $("#dlgReglesVictime").html("<b>" + $("#menuUtilisateur > b").html() + "</b> (id=" + id + ")").attr("monId", id);

    for (var i = 1; i <= 12; ++i)
        decocher($("#forcerRegle" + i));

    $("#dlgForcerLectureReglesMessage").val("");
}

function actionForcerLectureRegles() {
    var params = "";

    for (var i = 1; i <= 12; ++i)
        if (estCochee($("#forcerRegle" + i)))
            params += "," + i;

    params = " " + params.substring(1) + " " + $("#dlgForcerLectureReglesMessage").val();

    $("#dialogueForcerLectureRegles").dialog("close");
    envoyerCommande("/RULES " + $("#dlgReglesVictime").attr("monId") + params);
    $("#zoneSaisie").focus();
}

function forcerCouleur(id) {
    $("#menuUtilisateur").hide();
    $("#dialogueForcerCouleur").dialog("open");
    $("#dlgForcerCouleurPseudo").html("<b>" + $("#menuUtilisateur > b").html() + "</b> (id=" + id + ")").attr("monId", id);
    $("#dlgForcerCouleurCode").val("#000000").focus();
}

function actionForcerCouleur() {
    $("#dialogueForcerCouleur").dialog("close");
    envoyerCommande("/FORCECOLOR " + $("#dlgForcerCouleurPseudo").attr("monId") + " " + $("#dlgForcerCouleurCode").val());
}

function forcerStatut(id) {
    $("#menuUtilisateur").hide();
    $("#dialogueForcerStatut").dialog("open");
    $("#dlgForcerStatutPseudo").html("<b>" + $("#menuUtilisateur > b").html() + "</b> (id=" + id + ")").attr("monId", id);
    $("#dlgForcerStatutTexte").val("").focus();
    decocher($("#dlgForcerStatutBloquer"));
    decocher($("#dlgForcerStatutNotifier"));
}

function actionForcerStatut() {
    $("#dialogueForcerStatut").dialog("close");

    var options = "";
    if (estCochee($("#dlgForcerStatutBloquer")))
        options += "+L";
    if (estCochee($("#dlgForcerStatutNotifier")))
        options += "+N";

    envoyerCommande("/FORCEAWAY " + $("#dlgForcerStatutPseudo").attr("monId") + " " + options + $("#dlgForcerStatutTexte").val());
}

function liberer(id) {
    $("#menuUtilisateur").hide();
    envoyerCommande("/FREE " + id);
    $("#zoneSaisie").focus();
}

function ouvrirMenuSalon(salon, rejoindre, creer, detruire, prive, muet, dice, etendu) {
    var menu = $("#menuUtilisateur");

    menu.html('<b>' + salon + '</b>');

    if (rejoindre)
        menu.append('<a href="#" onclick="rejoindreSalon(); return false;">Aller dans ce salon</a>');
    else
        menu.append('<a href="#" onclick="envoyerFichier(0); return false;">Envoyer un fichier</a>');

    if (creer && !rejoindre)
        menu.append('<a href="#" onclick="envoyerMessageGeneral(); return false;">Message général</a>');

    if (creer)
        menu.append('<a href="#" onclick="creerSalon(); return false;">Créer un salon</a>');

    if (creer && !rejoindre)
        menu.append('<a href="#" onclick="changerOptionsSalon(' + prive + ',' + muet + ',' + dice + ',' + etendu + '); return false;">Options du salon</a>');

    if (detruire)
        menu.append('<a href="#" onclick="detruireSalon(); return false;">Supprimer ce salon</a>');

    positionnerMenu(menu);
}

function rejoindreSalon() {
    $("#menuUtilisateur").hide();
    envoyerCommande("/JOIN " + $("#menuUtilisateur > b").text());
    $("#zoneSaisie").focus();
}

function detruireSalon() {
    $("#menuUtilisateur").hide();
    envoyerCommande("/DESTROY " + $("#menuUtilisateur > b").text());
    $("#zoneSaisie").focus();
}

function creerSalon() {
    $("#menuUtilisateur").hide();
    $("#dialogueCreerSalon").dialog("open");
    $("#dlgCreerSalonNom").val("").focus();
}

function actionCreerSalon() {
    $("#dialogueCreerSalon").dialog("close");
    envoyerCommande("/CREATE " + $("#dlgCreerSalonNom").val());
    $("#zoneSaisie").focus();
}

function changerOptionsSalon(prive, muet, dice, etendu) {
    $("#menuUtilisateur").hide();
    $("#dialogueOptionsSalon").dialog("open");
    $("#dlgChangerNomSalon2").val("").hide();
    $("#dlgChangerNomSalon3").hide();
    $("#dlgChangerDescSalon2").val("").hide();
    $("#dlgChangerDescSalon3").hide();
    $(".dlgOptSalon").show().prop("disabled", false);

    if (prive)
        $("#dlgPasserSalonPrive").hide();
    else
        $("#dlgPasserSalonPublic").hide();

    if (muet)
        $("#dlgActiverMuet").hide();
    else
        $("#dlgDesactiverMuet").hide();

    if (dice)
        $("#dlgActiverDice").hide();
    else
        $("#dlgDesactiverDice").hide();

    if (! etendu) {
        $("#dlgChangerNomSalon1").prop("disabled", true);
        $("#dlgChangerDescSalon1").prop("disabled", true);
        $("#dlgPasserSalonPrive").prop("disabled", true);
        $("#dlgPasserSalonPublic").prop("disabled", true);
        $("#dlgActiverDice").prop("disabled", true);
        $("#dlgDesactiverDice").prop("disabled", true);
    }
}

function actionChangerNomSalon1() {
    $(".dlgOptSalon").prop("disabled", true);
    $("#dlgChangerNomSalon2").show().focus();
    $("#dlgChangerNomSalon3").show();
}

function actionChangerNomSalon3() {
    actionChangerOptionsSalon("NAME", $("#dlgChangerNomSalon2").val());
}

function actionChangerDescSalon1() {
    $(".dlgOptSalon").prop("disabled", true);
    $("#dlgChangerDescSalon2").show().focus();
    $("#dlgChangerDescSalon3").show();
}

function actionChangerDescSalon3() {
    actionChangerOptionsSalon("DESC", $("#dlgChangerDescSalon2").val());
}

function actionPasserSalonPublic() {
    actionChangerOptionsSalon("TYPE", "PUBLIC");
}

function actionPasserSalonPrive() {
    actionChangerOptionsSalon("TYPE", "PRIVATE");
}

function actionActiverMuet() {
    actionChangerOptionsSalon("MUTE", "ON");
}

function actionDesactiverMuet() {
    actionChangerOptionsSalon("MUTE", "OFF");
}

function actionActiverDice() {
    actionChangerOptionsSalon("DICE", "ON");
}

function actionDesactiverDice() {
    actionChangerOptionsSalon("DICE", "OFF");
}

function actionChangerOptionsSalon(option, param) {
    $("#dialogueOptionsSalon").dialog("close");
    envoyerCommande("/ALTER " + option + " " + param);
    $("#zoneSaisie").focus();
}

function envoyerMessageGeneral() {
    $("#menuUtilisateur").hide();
    $("#dialogueMessageGeneral").dialog("open");
    $("#dlgMsgGenTexte").val("").focus();
    cocher($("#dlgMsgGenSalon"));
}

function actionEnvoyerMessageGeneral() {
    $("#dialogueMessageGeneral").dialog("close");
    envoyerCommande("/SHOUT ROOM " +  $("#dlgMsgGenTexte").val());
    $("#zoneSaisie").focus();
}

function envoyerFichier(id) {
    $("#menuUtilisateur").hide();
    window.open("envoi?s=" + session + "&c=" + id, "upload", "width=700,height=230,left=100,top=200,resizable=yes,status=no");
    $("#zoneSaisie").focus();
}

function panneauModeration() {
    window.open("modcp?s=" + session, "modcp");
    $("#zoneSaisie").focus();
}

function changerStatut() {
    $("#dialogueStatut").dialog("open");
}

function actionChangerStatut() {
    $("#dialogueStatut").dialog("close");

    if (estCochee($("#dlgStatutAucun")))
        envoyerCommande("/AWAY");
    else if (estCochee($("#dlgStatutPredef")))
        envoyerCommande("/AWAYNA " + $("#dlgStatutListePredef").val());
    else {
        var cmd = "/AWAY";

        if (estCochee($("#dlgStatutNonDisponible")))
            cmd += "NA";

        envoyerCommande(cmd + " " + $("#dlgStatutTexte").val());
    }

    $("#zoneSaisie").focus();
}

function clicOptionStatutPerso() {
    cocher($("#dlgStatutPerso"));
    $("#dlgStatutTexte").focus();
}

function modifierOptions() {
    $("#dialogueOptions").dialog("open");
}

function actionModifierOptions() {
    $("#dialogueOptions").dialog("close");

    var cmd = "/MODE ";

    if (estCochee($("#dlgOptNoPv")))
        cmd += "+B";
    else
        cmd += "-B";

    if (estCochee($("#dlgOptDiscret")))
        cmd += "+D";
    else
        cmd += "-D";

    if (estCochee($("#dlgOptSansImages")))
        cmd += "+I";
    else
        cmd += "-I";

    if (estCochee($("#dlgOptMono")))
        cmd += "+M";
    else
        cmd += "-M";

    envoyerCommande(cmd);
    $("#zoneSaisie").focus();
}

function insererImage() {
    $("#dialogueInsererImage").dialog("open");
    $("#dlgInsererImageUrl").val("").focus();
}

function actionInsererImage() {
    $("#dialogueInsererImage").dialog("close");
    $("#zoneSaisie").val($("#zoneSaisie").val() + "[IMG]" + $("#dlgInsererImageUrl").val() + "[/IMG]").focus();
    positionnerCurseurFin();
}

function insererLien() {
    $("#dialogueInsererLien").dialog("open");
    $("#dlgInsererLienUrl").val("").focus();
    $("#dlgInsererLienLibelle").val("");
}

function actionInsererLien() {
    $("#dialogueInsererLien").dialog("close");
    var url = $("#dlgInsererLienUrl").val();
    var libelle = $("#dlgInsererLienLibelle").val();
    var balises;

    if (url == "") {
        $("#zoneSaisie").focus();
        return;
    }

    if (libelle == "")
        balises = "[URL]" + url + "[/URL]";
    else
        balises = "[URL=" + url + "]" + libelle + "[/URL]";

    $("#zoneSaisie").val($("#zoneSaisie").val() + balises).focus();
    positionnerCurseurFin();
}

function insererCode() {
    $("#dialogueCode").dialog("open");
    $("#dlgCodeContenu").val("").focus();
}

function clavierDlgCode(ev) {
    if (ev.keyCode == 9) {
        var editeur = $("#dlgCodeContenu").get(0);

        if (editeur.setSelectionRange) {
            // Code pour les bons navigateurs

            var position = editeur.selectionStart;
            var texte = editeur.value;

            editeur.value = texte.slice(0, position) + "\t" + texte.slice(position);
            editeur.focus();
            editeur.setSelectionRange(position + 1, position + 1);

        } else {
            // Code pour Internet Explorer uniquement

            editeur.value = editeur.value + "\t";
            sel = editeur.createTextRange();
            sel.move("character", editeur.value.length);
            sel.select();
        }

        return false;
    } else
        return true;
}

function actionInsererCode() {
    var langage = $("#dlgCodeColoration").val();
    var code = $("#dlgCodeContenu").val();

    if (langage == "?") {
        alert("Choisissez une coloration syntaxique, ou 'Aucune' si le langage n'est pas dans la liste.");
        $("#dlgCodeColoration").focus();
        return;
    }

    if (code == "") {
        alert("Saisissez ou collez votre code avant de valider.");
        $("#dlgCodeContenu").focus();
        return;
    }

    $("#dialogueCode").dialog("close");
    $("#zoneSaisie").val($("#zoneSaisie").val() + "[CODE" + langage + "]" + code).focus();
    envoyerTexte();
}

function changerSalon(salon) {
    envoyerCommande("/JOIN " + salon);
    $("#zoneSaisie").focus();
}
