# Prompts for approved changes

Use manage access and an account with the required QTIS permissions. Supply
the real details in your private AI System conversation, not in GitHub issues.

## Create

> Help me create a patient profile in my selected practice. Ask for the name,
> unique case file number, and any missing details. Check for an existing
> profile first. Show the exact new profile and wait for my approval before saving.

## Update

> Find the patient by the case file number I provide. Show the current contact
> details and the exact changes I request. Wait for my approval before saving.
> Leave every other field unchanged.

## Archive

> Find the patient by the case file number I provide and show me the matching
> profile and current status. Explain the archive effect, then wait for my
> explicit approval before archiving. Do not permanently erase any records.

## Verify

> Read the profile again and confirm its current status and whether it is archived.

The calling application must preserve the original random request key on
uncertain retries. See [patient states](../docs/patient-states.md).
