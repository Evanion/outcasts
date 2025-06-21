import {
  AbilityBuilder,
  PureAbility,
  type ExtractSubjectType,
  type InferSubjects,
  type Subject,
} from "@casl/ability";
import { UserRole } from "~/modules/acl/server/entities/user-role.entity";
import { Action } from "~/modules/acl/server/enums/action.enum";
import { Role } from "~/modules/acl/server/enums/role.enum";
import { Profile } from "./entities/profile";

type Subjects = InferSubjects<typeof Profile> | "all";

type AppAbility = PureAbility<[Action, Subjects]>;

export class ProfileAbility {
  public forUser(userRole: UserRole) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      PureAbility as any
    );

    can(Action.Read, Profile);
    can(Action.Update, Profile, { personaFrn: userRole.personaFrn });

    if (userRole.role === Role.Admin) {
      can(Action.Manage, Profile);
    }

    return build({
      detectSubjectType: (item: Profile) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
