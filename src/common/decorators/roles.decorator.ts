import type { UserRole } from '../../core/user/domain';

type RouteRolesMetadata = Map<PropertyKey, UserRole[]>;

const routeRoles = new WeakMap<object, RouteRolesMetadata>();

export const Roles =
  (roles: UserRole[]): MethodDecorator & PropertyDecorator =>
  (target: object, propertyKey: string | symbol | undefined): void => {
    if (!propertyKey) {
      return;
    }

    const metadata = routeRoles.get(target) ?? new Map<PropertyKey, UserRole[]>();
    metadata.set(propertyKey, [...roles]);
    routeRoles.set(target, metadata);
  };

export const getRouteRoles = (target: object, propertyKey: string | symbol): UserRole[] => {
  const metadata = routeRoles.get(target);
  return metadata?.get(propertyKey) ?? [];
};
