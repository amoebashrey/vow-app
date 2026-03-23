-- Allow cascade delete on contract_participants when contract is deleted
ALTER TABLE contract_participants
  DROP CONSTRAINT IF EXISTS contract_participants_contract_id_fkey,
  ADD CONSTRAINT contract_participants_contract_id_fkey
    FOREIGN KEY (contract_id) REFERENCES contracts(id)
    ON DELETE CASCADE;

-- Creators can delete contracts that have no accepted participants
CREATE POLICY "creators_can_delete_pending_contracts"
  ON contracts FOR DELETE
  USING (
    auth.uid() = creator_id
    AND NOT EXISTS (
      SELECT 1 FROM contract_participants
      WHERE contract_id = contracts.id
      AND accepted = true
    )
  );
