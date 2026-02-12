export function apiSuccess(data: any, message = 'Success') {
  return { success: true, message, data };
}

export function apiError(error: string, status = 400) {
  return { success: false, error, status };
}
