import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Container } from 'typedi';
import { Repository } from 'typeorm';
import { v5 as uuidv5 } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { PersonaService } from '~/modules/persona/persona.service';
import { Persona } from '~/modules/persona/entities/persona.entity';

// Mock the uuid module
vi.mock('uuid', () => ({
  v5: vi.fn()
}));

// Use a valid UUID for testing namespace
const TEST_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

describe('PersonaService', () => {
  let personaService: PersonaService;
  let mockRepository: any;
  let mockDataSource: any;
  let mockUuidv5: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Get the mocked uuidv5 function
    mockUuidv5 = vi.mocked(uuidv5);

    // Create mock repository with proper mock functions
    mockRepository = {
      findOneBy: vi.fn(),
      save: vi.fn(),
      create: vi.fn(),
    };

    // Create mock data source
    mockDataSource = {
      getRepository: vi.fn().mockReturnValue(mockRepository),
    };

    // Create service instance with mocked data source
    personaService = new PersonaService(mockDataSource);
  });

  describe('getOrCreatePersonaByIdentifier', () => {
    it('should create a new persona when identifier does not exist', async () => {
      const identifier = 'test-identifier-123';
      const expectedId = 'test-uuid-123';
      
      // Mock uuidv5 to return our expected ID
      mockUuidv5.mockReturnValue(expectedId);
      
      // Mock repository to return null (persona doesn't exist)
      mockRepository.findOneBy.mockResolvedValue(null);
      
      // Mock repository create and save
      const now = new Date();
      const mockPersona = plainToInstance(Persona, { id: expectedId, createdAt: now, updatedAt: now });
      mockRepository.create.mockReturnValue(mockPersona);
      mockRepository.save.mockResolvedValue(mockPersona);

      const persona = await personaService.getOrCreatePersonaByIdentifier(identifier);

      expect(persona).toBeDefined();
      expect(persona.id).toBe(expectedId);
      expect(persona.createdAt).toBeInstanceOf(Date);
      expect(persona.updatedAt).toBeInstanceOf(Date);

      // Verify uuidv5 was called with correct parameters
      expect(mockUuidv5).toHaveBeenCalledWith(identifier, process.env.PERSONA_NS);
      
      // Verify repository methods were called correctly
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: expectedId });
      expect(mockRepository.create).toHaveBeenCalledWith({ id: expectedId });
      expect(mockRepository.save).toHaveBeenCalledWith(mockPersona);
    });

    it('should return existing persona when identifier already exists', async () => {
      const identifier = 'existing-identifier-456';
      const expectedId = 'existing-uuid-456';
      
      // Mock uuidv5 to return our expected ID
      mockUuidv5.mockReturnValue(expectedId);
      
      // Mock existing persona
      const existingPersona = plainToInstance(Persona, {
        id: expectedId,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      });
      
      mockRepository.findOneBy.mockResolvedValue(existingPersona);

      const persona = await personaService.getOrCreatePersonaByIdentifier(identifier);

      expect(persona).toBeDefined();
      expect(persona.id).toBe(expectedId);
      expect(persona.createdAt).toEqual(existingPersona.createdAt);
      expect(persona.updatedAt).toEqual(existingPersona.updatedAt);

      // Verify uuidv5 was called
      expect(mockUuidv5).toHaveBeenCalledWith(identifier, process.env.PERSONA_NS);
      
      // Verify repository was called but save was not
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: expectedId });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should generate consistent UUIDs for the same identifier', async () => {
      const identifier = 'consistent-identifier-789';
      const expectedId = 'consistent-uuid-789';
      
      // Mock uuidv5 to return our expected ID
      mockUuidv5.mockReturnValue(expectedId);
      
      mockRepository.findOneBy.mockResolvedValue(null);
      const mockPersona = plainToInstance(Persona, { id: expectedId });
      mockRepository.create.mockReturnValue(mockPersona);
      mockRepository.save.mockResolvedValue(mockPersona);

      const persona1 = await personaService.getOrCreatePersonaByIdentifier(identifier);
      const persona2 = await personaService.getOrCreatePersonaByIdentifier(identifier);

      expect(persona1.id).toBe(expectedId);
      expect(persona2.id).toBe(expectedId);
      expect(persona1.id).toBe(persona2.id);
      
      // Verify uuidv5 was called twice with the same parameters
      expect(mockUuidv5).toHaveBeenCalledTimes(2);
      expect(mockUuidv5).toHaveBeenNthCalledWith(1, identifier, process.env.PERSONA_NS);
      expect(mockUuidv5).toHaveBeenNthCalledWith(2, identifier, process.env.PERSONA_NS);
    });

    it('should generate different UUIDs for different identifiers', async () => {
      const identifier1 = 'different-identifier-1';
      const identifier2 = 'different-identifier-2';
      const expectedId1 = 'different-uuid-1';
      const expectedId2 = 'different-uuid-2';
      
      // Mock uuidv5 to return different IDs for different identifiers
      mockUuidv5.mockReturnValueOnce(expectedId1).mockReturnValueOnce(expectedId2);
      
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockImplementation((data: any) => plainToInstance(Persona, data));
      mockRepository.save.mockImplementation((persona: any) => Promise.resolve(persona));

      const persona1 = await personaService.getOrCreatePersonaByIdentifier(identifier1);
      const persona2 = await personaService.getOrCreatePersonaByIdentifier(identifier2);

      expect(persona1.id).not.toBe(persona2.id);
      expect(persona1.id).toBe(expectedId1);
      expect(persona2.id).toBe(expectedId2);
    });

    it('should handle Battle.Net sub identifiers correctly', async () => {
      const battleNetSub = '101061088';
      const expectedId = 'battlenet-uuid-123';
      
      // Mock uuidv5 to return our expected ID
      mockUuidv5.mockReturnValue(expectedId);
      
      mockRepository.findOneBy.mockResolvedValue(null);
      const mockPersona = plainToInstance(Persona, { id: expectedId });
      mockRepository.create.mockReturnValue(mockPersona);
      mockRepository.save.mockResolvedValue(mockPersona);

      const persona = await personaService.getOrCreatePersonaByIdentifier(battleNetSub);

      expect(persona.id).toBe(expectedId);
      expect(mockUuidv5).toHaveBeenCalledWith(battleNetSub, process.env.PERSONA_NS);
    });

    it('should handle empty string identifier', async () => {
      const emptyIdentifier = '';
      const expectedId = 'empty-uuid-123';
      
      // Mock uuidv5 to return our expected ID
      mockUuidv5.mockReturnValue(expectedId);
      
      mockRepository.findOneBy.mockResolvedValue(null);
      const mockPersona = plainToInstance(Persona, { id: expectedId });
      mockRepository.create.mockReturnValue(mockPersona);
      mockRepository.save.mockResolvedValue(mockPersona);

      const persona = await personaService.getOrCreatePersonaByIdentifier(emptyIdentifier);

      expect(persona.id).toBe(expectedId);
      expect(mockUuidv5).toHaveBeenCalledWith(emptyIdentifier, process.env.PERSONA_NS);
    });

    it('should handle special characters in identifier', async () => {
      const specialIdentifier = 'test@example.com#123!@#$%^&*()';
      const expectedId = 'special-uuid-123';
      
      // Mock uuidv5 to return our expected ID
      mockUuidv5.mockReturnValue(expectedId);
      
      mockRepository.findOneBy.mockResolvedValue(null);
      const mockPersona = plainToInstance(Persona, { id: expectedId });
      mockRepository.create.mockReturnValue(mockPersona);
      mockRepository.save.mockResolvedValue(mockPersona);

      const persona = await personaService.getOrCreatePersonaByIdentifier(specialIdentifier);

      expect(persona.id).toBe(expectedId);
      expect(mockUuidv5).toHaveBeenCalledWith(specialIdentifier, process.env.PERSONA_NS);
    });
  });

  describe('UUID generation', () => {
    it('should call uuidv5 with correct parameters', async () => {
      const identifier = 'uuid-format-test';
      const expectedId = 'test-uuid-format';
      
      // Mock uuidv5 to return our expected ID
      mockUuidv5.mockReturnValue(expectedId);
      
      mockRepository.findOneBy.mockResolvedValue(null);
      const mockPersona = plainToInstance(Persona, { id: expectedId });
      mockRepository.create.mockReturnValue(mockPersona);
      mockRepository.save.mockResolvedValue(mockPersona);

      const persona = await personaService.getOrCreatePersonaByIdentifier(identifier);

      expect(persona.id).toBe(expectedId);
      expect(mockUuidv5).toHaveBeenCalledWith(identifier, process.env.PERSONA_NS);
    });
  });

  describe('Database operations', () => {
    it('should not create duplicate records for the same identifier', async () => {
      const identifier = 'duplicate-test';
      const expectedId = 'duplicate-uuid-123';
      
      // Mock uuidv5 to return our expected ID
      mockUuidv5.mockReturnValue(expectedId);
      
      // First call: persona doesn't exist
      mockRepository.findOneBy.mockResolvedValueOnce(null);
      const mockPersona = plainToInstance(Persona, { id: expectedId });
      mockRepository.create.mockReturnValue(mockPersona);
      mockRepository.save.mockResolvedValue(mockPersona);

      await personaService.getOrCreatePersonaByIdentifier(identifier);

      // Second call: persona exists
      mockRepository.findOneBy.mockResolvedValueOnce(mockPersona);

      await personaService.getOrCreatePersonaByIdentifier(identifier);

      // Verify create was only called once
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle concurrent calls for the same identifier', async () => {
      const identifier = 'concurrent-test';
      const expectedId = 'concurrent-uuid-123';
      
      // Mock uuidv5 to return our expected ID
      mockUuidv5.mockReturnValue(expectedId);
      
      // Mock repository to return null on first call, then the created persona
      mockRepository.findOneBy
        .mockResolvedValueOnce(null) // First call
        .mockResolvedValueOnce(null) // Second call (concurrent)
        .mockResolvedValueOnce(null) // Third call (concurrent)
        .mockResolvedValueOnce(null) // Fourth call (concurrent)
        .mockResolvedValueOnce(null); // Fifth call (concurrent)
      
      const mockPersona = plainToInstance(Persona, { id: expectedId });
      mockRepository.create.mockReturnValue(mockPersona);
      mockRepository.save.mockResolvedValue(mockPersona);

      // Make multiple concurrent calls
      const promises = Array.from({ length: 5 }, () => 
        personaService.getOrCreatePersonaByIdentifier(identifier)
      );

      const results = await Promise.all(promises);

      // All results should have the same ID
      const firstId = results[0].id;
      results.forEach(persona => {
        expect(persona.id).toBe(firstId);
      });

      // Verify repository methods were called
      expect(mockRepository.findOneBy).toHaveBeenCalledTimes(5);
      expect(mockRepository.create).toHaveBeenCalledTimes(5);
      expect(mockRepository.save).toHaveBeenCalledTimes(5);
    });
  });

  describe('Error handling', () => {
    it('should handle database errors gracefully', async () => {
      const identifier = 'error-test';
      const expectedId = 'error-uuid-123';
      
      // Mock uuidv5 to return our expected ID
      mockUuidv5.mockReturnValue(expectedId);
      
      mockRepository.findOneBy.mockRejectedValue(new Error('Database connection failed'));

      await expect(
        personaService.getOrCreatePersonaByIdentifier(identifier)
      ).rejects.toThrow('Database connection failed');
    });

    it('should handle save errors gracefully', async () => {
      const identifier = 'save-error-test';
      const expectedId = 'save-error-uuid-123';
      
      // Mock uuidv5 to return our expected ID
      mockUuidv5.mockReturnValue(expectedId);
      
      mockRepository.findOneBy.mockResolvedValue(null);
      const mockPersona = plainToInstance(Persona, { id: expectedId });
      mockRepository.create.mockReturnValue(mockPersona);
      mockRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(
        personaService.getOrCreatePersonaByIdentifier(identifier)
      ).rejects.toThrow('Save failed');
    });
  });
}); 