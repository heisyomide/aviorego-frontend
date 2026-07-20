import { api } from '../../../../../lib/api';

import type {
  AvailableJob,
  JobDetails,
} from '../types';

class RiderJobsService {
  /**
   * Available Jobs
   */
  async getAvailableJobs(): Promise<AvailableJob[]> {
    const response = await api.get(
      '/rider/jobs/available',
    );

    return response.data;
  }

  /**
   * Get Single Job
   */
  async getJob(
    shipmentId: string,
  ): Promise<JobDetails> {
    const response = await api.get(
      `/rider/jobs/${shipmentId}`,
    );

    return response.data.shipment;
  }

  /**
   * Accept Job
   */
  async acceptJob(
    shipmentId: string,
  ) {
    const response = await api.post(
      `/rider/jobs/${shipmentId}/accept`,
    );

    return response.data;
  }

  /**
   * Arrived at Pickup
   * Customer Timeline:
   * PICKED_UP
   */
  async arrivedAtPickup(
    shipmentId: string,
  ) {
    const response = await api.patch(
      `/rider/jobs/${shipmentId}/arrive-pickup`,
    );

    return response.data;
  }

  /**
   * Confirm Pickup
   * Customer Timeline:
   * IN_TRANSIT
   */
  async pickupShipment(
    shipmentId: string,
  ) {
    const response = await api.patch(
      `/rider/jobs/${shipmentId}/pickup`,
    );

    return response.data;
  }

  /**
   * Arrived at Destination
   * Customer Timeline:
   * OUT_FOR_DELIVERY
   */
  async arrivedAtDestination(
    shipmentId: string,
  ) {
    const response = await api.patch(
      `/rider/jobs/${shipmentId}/arrive-destination`,
    );

    return response.data;
  }

  /**
   * Complete Delivery
   * Customer Timeline:
   * DELIVERED
   */
  async completeDelivery(
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

export default new RiderJobsService();