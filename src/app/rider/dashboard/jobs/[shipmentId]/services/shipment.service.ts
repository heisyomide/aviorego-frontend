import { api } from '../../../../../../lib/api';

import type {
  ShipmentResponse,
} from '../types';

class ShipmentService {
  /**
   * Get Shipment Details
   */
  async getShipment(
    shipmentId: string,
  ): Promise<ShipmentResponse> {
    const response = await api.get(
      `/rider/jobs/${shipmentId}`,
    );

    return response.data;
  }

  /**
   * Accept Job
   */
  async acceptJob(
    shipmentId: string,
  ) {
    const response = await api.post(
      `/rider/jobs/${shipmentId}/accept`,
      {},
    );

    return response.data;
  }

  /**
   * Arrived At Pickup
   */
  async arrivedAtPickup(
    shipmentId: string,
  ) {
    const response = await api.patch(
      `/rider/jobs/${shipmentId}/arrive-pickup`,
      {},
    );

    return response.data;
  }

  /**
   * Pickup Confirmed
   */
  async pickup(
    shipmentId: string,
  ) {
    const response = await api.patch(
      `/rider/jobs/${shipmentId}/pickup`,
      {},
    );

    return response.data;
  }

  /**
   * Arrived At Destination
   */
  async arrivedAtDestination(
    shipmentId: string,
  ) {
    const response = await api.patch(
      `/rider/jobs/${shipmentId}/arrive-destination`,
      {},
    );

    return response.data;
  }

  /**
   * Complete Delivery
   */
  async complete(
    shipmentId: string,
    verificationPin: string,
  ) {
    const response = await api.post(
      `/rider/jobs/${shipmentId}/complete`,
      {
        verificationPin,
      },
    );

    return response.data;
  }
}

export default new ShipmentService();