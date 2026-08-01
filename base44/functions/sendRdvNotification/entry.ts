import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Require authenticated user
    await base44.auth.me();

    const body = await req.json();
    const { rdvId } = body;

    if (!rdvId || typeof rdvId !== 'string') {
      return Response.json({ error: 'Missing rdvId' }, { status: 400 });
    }

    // Load RDV from DB — never trust client-supplied content
    const rdv = await base44.asServiceRole.entities.RendezVous.get(rdvId);
    if (!rdv) {
      return Response.json({ error: 'RDV not found' }, { status: 404 });
    }

    const typeLabels = {
      decouverte_biodiversite: 'Découverte Biodiversité',
      bio_focus_terrain: 'Bio-Focus Terrain',
      permaculture: 'Permaculture',
      recyclage: 'Recyclage',
      autre: 'Autre',
    };

    // Email à l'admin (brunolivier@yahoo.com)
    const adminEmailBody = `
Nouvelle demande de RDV sur Terra Nova 🌿

📚 École : ${rdv.nom_ecole}
👤 Enseignant : ${rdv.nom_enseignant}
📧 Email : ${rdv.email_enseignant}
🎓 Classe : ${rdv.classe_niveau} (${rdv.nombre_eleves || 'N/A'} élèves)
🗓️ Date souhaitée : ${rdv.date_souhaitee}
${rdv.date_alternative ? `📅 Date alternative : ${rdv.date_alternative}` : ''}
🌲 Type d'atelier : ${typeLabels[rdv.type_atelier] || rdv.type_atelier}
${rdv.message ? `💬 Message : ${rdv.message}` : ''}

🔑 CODE BILAN ENSEIGNANT : ${rdv.code_bilan}
(Ce code permettra à l'enseignant d'accéder au formulaire de bilan post-atelier)

---
Connectez-vous à l'interface admin pour confirmer ou refuser cette demande.
    `.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'brunolivier@yahoo.com',
      subject: `🌿 Nouvelle demande de RDV - ${rdv.nom_ecole} (${rdv.date_souhaitee})`,
      body: adminEmailBody,
    });

    // Email de confirmation à l'enseignant avec le code bilan
    const enseignantEmailBody = `Bonjour ${rdv.nom_enseignant},

Nous avons bien reçu votre demande de RDV pour le ${rdv.date_souhaitee}.

Notre équipe vous contactera dans les plus brefs délais pour confirmer votre créneau.

---
🔑 VOTRE CODE BILAN PERSONNEL : ${rdv.code_bilan}

Ce code est strictement personnel et confidentiel.
Après votre atelier, rendez-vous sur la page "Bilan Pédagogique" de la plateforme Terra Nova et saisissez ce code pour accéder à votre dossier d'évaluation.

Conservez précieusement ce code — il est le seul moyen d'accéder à votre dossier de bilan.

---
À bientôt,
L'équipe Terra Nova 🌿`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: rdv.email_enseignant,
      subject: `✅ Demande de RDV Terra Nova reçue — Code bilan : ${rdv.code_bilan}`,
      body: enseignantEmailBody,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});